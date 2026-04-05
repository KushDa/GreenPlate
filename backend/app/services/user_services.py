# app/services/user_services.py

import os
import razorpay
from fastapi.responses import JSONResponse
from starlette import status
from firebase_admin import auth
from datetime import datetime, timedelta
import secrets

from app.core.firebase import db, firestore
from app.core.config import settings
from app.schemas.user import CreateOrderSchema, UpdateUserProfileSchema, VerifyPaymentSchema


class UserService:
  def __init__(self):
    self.razorpay_client = razorpay.Client(auth=(
      settings.RAZORPAY_KEY_ID,
      settings.RAZORPAY_KEY_SECRET
    ))

  async def get_user_details(self, id_token: str):
    try:
      decoded_token = auth.verify_id_token(id_token)
      uid = decoded_token["uid"]
      user_doc = db.collection("users").document(uid).get()
      if user_doc.exists:
        return user_doc.to_dict(), uid
      return None, None
    except Exception:
      return None, None

  def serialize_firestore_data(self, data: dict):
    for k, v in data.items():
      if isinstance(v, datetime):
        data[k] = v.isoformat()
    return data

  async def update_user_profile(self, profile_data: UpdateUserProfileSchema, id_token: str):
    try:
      user_data, user_uid = await self.get_user_details(id_token)
      if not user_data:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Unauthorized"})

      user_ref = db.collection("users").document(user_uid)
      updates = {}

      if profile_data.name is not None:
        updates["name"] = profile_data.name.strip()
      if profile_data.roll_number is not None:
        updates["roll_number"] = profile_data.roll_number.strip()
      if profile_data.phone is not None:
        updates["phone"] = profile_data.phone.strip()

      if not updates:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "No fields to update"})

      updates["updated_at"] = firestore.SERVER_TIMESTAMP
      user_ref.update(updates)

      return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Profile updated successfully"})
    except Exception as e:
      return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"message": str(e)})

  async def get_user_menu(self, id_token: str):
    try:
      user_data, user_uid = await self.get_user_details(id_token)

      if not user_data:
        return JSONResponse(
          status_code=status.HTTP_401_UNAUTHORIZED,
          content={"message": "Invalid or expired token."}
        )

      college_id = user_data.get("college_id")

      stalls_ref = (
        db.collection("colleges")
        .document(college_id)
        .collection("stalls")
        .where("status", "==", "active")
        .where("isVerified", "==", True)
      )

      stalls_docs = stalls_ref.stream()

      stalls_response = []

      for stall_doc in stalls_docs:
        stall_data = stall_doc.to_dict()
        stall_id = stall_doc.id

        menu_items_ref = (
          stall_doc.reference
          .collection("menu_items")
          .where("is_available", "==", True)
          .order_by("created_at")
        )

        menu_items_docs = menu_items_ref.stream()

        menu_items = []
        for item_doc in menu_items_docs:
          item = item_doc.to_dict()
          item["item_id"] = item_doc.id
          item = self.serialize_firestore_data(item)
          item.pop("created_at", None)
          item.pop("updated_at", None)

          menu_items.append(item)

        if menu_items:
          stalls_response.append({
            "stall_id": stall_id,
            "stall_name": stall_data.get("name"),
            "menu_items": menu_items
          })

      return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
          "college_id": college_id,
          "stalls": stalls_response
        }
      )

    except Exception as e:
      return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": str(e)}
      )

  async def get_eco_points(self, id_token: str):
    try:
      user_data, _ = await self.get_user_details(id_token)
      if not user_data:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})

      return JSONResponse(
        status_code=200,
        content={
          "eco_points": user_data.get("eco_points", 0),
          "lifetime_eco_points": user_data.get("lifetime_eco_points", 0),
          "tier": user_data.get("tier", "SEED")
        }
      )

    except Exception as e:
      return JSONResponse(status_code=500, content={"message": str(e)})

  def calculate_eco_points(self, total_amount: int, order_type: str = "NORMAL"):
    base_points = max(1, total_amount // 10)

    if order_type == "RESALE":
      base_points += 5

    return base_points

  def get_eco_tier(self, lifetime_points: int):
    if lifetime_points >= 300:
      return "PLANET_HERO"
    elif lifetime_points >= 100:
      return "GREEN"
    return "SEED"

  async def create_payment_order(self, order_data: CreateOrderSchema, id_token: str):
    try:
        user_data, user_uid = await self.get_user_details(id_token)
        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "Invalid or expired token."}
            )

        college_id = user_data.get("college_id")
        stall_id = order_data.stall_id
        redeem_points = getattr(order_data, "eco_points_to_redeem", 0)

        total_amount = 0
        order_items = []

        menu_ref = (
            db.collection("colleges")
            .document(college_id)
            .collection("stalls")
            .document(stall_id)
            .collection("menu_items")
        )

        stall_doc = (
            db.collection("colleges")
            .document(college_id)
            .collection("stalls")
            .document(stall_id)
            .get()
        )

        stall_name = stall_doc.to_dict().get("name", "Unknown Stall")

        for cart_item in order_data.items:
            item_doc = menu_ref.document(cart_item.item_id).get()

            if not item_doc.exists:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "One or more items in your cart no longer exist."}
                )

            item_data = item_doc.to_dict()

            if item_data.get("is_available") is False:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": f"Sorry, {item_data.get('name')} is currently out of stock."}
                )

            price = item_data.get("price", 0)
            quantity = cart_item.quantity
            total_amount += price * quantity

            order_items.append({
                "item_id": cart_item.item_id,
                "name": item_data.get("name"),
                "price": price,
                "quantity": quantity
            })

        if total_amount <= 0:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Invalid order total."}
            )

        user_points = user_data.get("eco_points", 0)

        if redeem_points > user_points:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Not enough eco points."}
            )

        discount_amount = 0
        if redeem_points > 0 and total_amount >= 50:
            raw_discount = redeem_points * 0.5
            max_discount = total_amount * 0.2
            discount_amount = min(raw_discount, max_discount)
            total_amount -= discount_amount

        user_snapshot = {
            "name": user_data.get("name", "Unknown Student"),
            "roll_number": user_data.get("roll_number", "N/A"),
            "phone": user_data.get("phone", "")
        }

        new_order_ref = db.collection("orders").document()
        internal_order_id = new_order_ref.id

        firestore_order_data = {
            "user_id": user_uid,
            "user_details": user_snapshot,
            "stall_id": stall_id,
            "stall_name": stall_name,
            "college_id": college_id,
            "items": order_items,
            "original_total_amount": total_amount + discount_amount,
            "discount_amount": discount_amount,
            "eco_points_redeemed": redeem_points,
            "total_amount": total_amount,
            "status": "PENDING",
            "refund_policy": {
                "ready_refund_percent": 50,
                "cancellation_allowed": True
            },
            "refund": {
                "status": "NOT_APPLICABLE",
                "amount": 0
            },
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        }

        new_order_ref.set(firestore_order_data)

        if redeem_points > 0:
            db.collection("users").document(user_uid).update({
                "eco_points": firestore.Increment(-redeem_points)
            })

        razorpay_order = self.razorpay_client.order.create(data={
            "amount": int(total_amount * 100),
            "currency": "INR",
            "receipt": f"rcpt_{internal_order_id[:8]}",
            "notes": {
                "stall_id": stall_id,
                "user_uid": user_uid,
                "college_id": college_id,
                "internal_order_id": internal_order_id
            }
        })

        new_order_ref.update({"razorpay_order_id": razorpay_order["id"]})

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key_id": os.environ.get("RAZORPAY_KEY_ID"),
                "internal_order_id": internal_order_id,
                "discount_amount": discount_amount,
                "message": "Order created successfully"
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": f"Payment Error: {str(e)}"}
        )

  async def get_user_orders(self, id_token: str):
    try:
      user_data, user_uid = await self.get_user_details(id_token)
      if not user_data:
        return JSONResponse(
          status_code=status.HTTP_401_UNAUTHORIZED,
          content={"message": "Invalid or expired token."}
        )

      docs = (
        db.collection("orders")
        .where("user_id", "==", user_uid)
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .stream()
      )

      orders = []
      for doc in docs:
        data = doc.to_dict()

        visible_code = data.get("pickup_code") if data.get("status") in ["PAID", "READY"] else None

        refund_data = data.get("refund")
        if refund_data:
          refund_data = self.serialize_firestore_data(refund_data)

        orders.append({
          "id": doc.id,
          "items": data["items"],
          "cafeteriaName": data.get("stall_name", "Unknown Stall"),
          "status": self.normalize_order_status(data["status"]),
          "qrCode": visible_code,
          "total_amount": data.get("total_amount", 0),
          "refund": refund_data,
          "refund_policy": data.get("refund_policy")
        })

      return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=orders
      )

    except Exception as e:
      return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": str(e)}
      )

  async def verify_payment_and_update_order(self, payment_data: VerifyPaymentSchema, id_token: str):
    try:
        params_dict = {
            "razorpay_order_id": payment_data.razorpay_order_id,
            "razorpay_payment_id": payment_data.razorpay_payment_id,
            "razorpay_signature": payment_data.razorpay_signature,
        }

        try:
            self.razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception:
            return JSONResponse(
                status_code=400,
                content={"message": "Signature verification failed"}
            )

        internal_order_id = payment_data.internal_order_id
        order_ref = db.collection("orders").document(internal_order_id)
        order_doc = order_ref.get()

        if not order_doc.exists:
            return JSONResponse(
                status_code=400,
                content={"message": "Order not found"}
            )

        order_data = order_doc.to_dict()

        if order_data.get("status") == "PAID":
            return JSONResponse(
                status_code=200,
                content={"message": "Payment already verified"}
            )

        user_id = order_data.get("user_id")
        total_amount = order_data.get("total_amount", 0)
        order_type = order_data.get("order_type", "NORMAL")

        points_earned = max(1, total_amount // 10)
        if order_type == "RESALE":
            points_earned += 5

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        user_data = user_doc.to_dict() if user_doc.exists else {}

        new_lifetime = user_data.get("lifetime_eco_points", 0) + points_earned

        if new_lifetime >= 300:
            new_tier = "PLANET_HERO"
        elif new_lifetime >= 100:
            new_tier = "GREEN"
        else:
            new_tier = "SEED"

        pickup_code = str(1000 + secrets.randbelow(9000))

        batch = db.batch()

        batch.update(order_ref, {
            "razorpay_payment_id": payment_data.razorpay_payment_id,
            "status": "PAID",
            "pickup_code": pickup_code,
            "eco_points_earned": points_earned,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        batch.update(user_ref, {
            "eco_points": firestore.Increment(points_earned),
            "lifetime_eco_points": firestore.Increment(points_earned),
            "tier": new_tier,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        batch.commit()

        return JSONResponse(
            status_code=200,
            content={
                "message": "Payment verified & eco points awarded",
                "eco_points_earned": points_earned,
                "tier": new_tier
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"message": str(e)}
        )

  def normalize_order_status(status: str):
    status = status.upper() if status else ""
    return {
      "PENDING": "Payment Pending",
      "PAID": "Reserved",
      "CLAIMED": "Claimed",
      "READY": "Ready",
      "COMPLETED": "Completed",
      "CANCELLED": "Cancelled"
    }.get(status, "Unknown")

  def calculate_refund(order: dict):
    total = order.get("total_amount", 0)
    status = order.get("status")

    if status in ["CREATED"]:
      return total, "FULL_REFUND"

    if status == "PAID":
      return total, "FULL_REFUND"

    if status == "READY":
      percent = (
        order.get("refund_policy", {})
        .get("ready_refund_percent", 50)
      )
      refund_amount = int(total * percent / 100)
      return refund_amount, "PARTIAL_REFUND"

    return 0, "NO_REFUND"

  async def cancel_order(self, order_id: str, id_token: str):
    try:
        user_data, user_uid = await self.get_user_details(id_token)
        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "Unauthorized"}
            )

        now = datetime.now()

        week_start = user_data.get("cancellation_week_start")
        current_count = user_data.get("cancellations_this_week", 0)

        if week_start:
            if isinstance(week_start, str):
                week_start = datetime.fromisoformat(week_start)
        else:
            week_start = now

        if (now.replace(tzinfo=None) - week_start.replace(tzinfo=None)).days >= 7:
            current_count = 0
            week_start = now
            db.collection("users").document(user_uid).update({
                "cancellation_week_start": firestore.SERVER_TIMESTAMP,
                "cancellations_this_week": 0
            })

        if current_count >= 20:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Weekly cancellation limit reached."}
            )

        order_ref = db.collection("orders").document(order_id)
        order_doc = order_ref.get()

        if not order_doc.exists:
            return JSONResponse(
                status_code=404,
                content={"message": "Order not found"}
            )

        order_data = order_doc.to_dict()

        if order_data.get("user_id") != user_uid:
            return JSONResponse(
                status_code=403,
                content={"message": "You do not own this order"}
            )

        current_status = order_data.get("status")

        if current_status in ["CLAIMED", "COMPLETED", "CANCELLED"]:
            return JSONResponse(
                status_code=400,
                content={"message": f"Cannot cancel order with status: {current_status}"}
            )

        total_amount = order_data.get("total_amount", 0)
        refund_amount = 0
        refund_type = "NO_REFUND"

        if current_status == "READY":
            refund_amount = int(total_amount * 0.70)
            refund_type = "PARTIAL_REFUND"
        elif current_status in ["PAID", "RESERVED"]:
            refund_amount = total_amount
            refund_type = "FULL_REFUND"

        payment_id = order_data.get("razorpay_payment_id")
        existing_refund = order_data.get("refund", {})
        refund_status = existing_refund.get("status", "NOT_APPLICABLE")
        refund_id = existing_refund.get("razorpay_refund_id")

        if refund_amount > 0 and payment_id and refund_status not in ["INITIATED", "COMPLETED"]:
            try:
                refund_response = self.razorpay_client.payment.refund(
                    payment_id,
                    {
                        "amount": int(refund_amount * 100),
                        "speed": "normal",
                        "notes": {
                            "order_id": order_id,
                            "type": refund_type,
                            "reason": "User Cancelled"
                        }
                    }
                )
                refund_id = refund_response.get("id")
                refund_status = "INITIATED"
            except Exception as e:
                print("[Refund Error]", e)
                refund_status = "FAILED"

        resale_created = False

        if current_status == "READY":
            resale_item = {
                "original_order_id": order_id,
                "original_user_id": user_uid,
                "college_id": order_data.get("college_id"),
                "stall_id": order_data.get("stall_id"),
                "stall_name": order_data.get("stall_name"),
                "items": order_data.get("items", []),
                "original_price": total_amount,
                "discounted_price": int(total_amount * 0.70),
                "max_price": int(total_amount * 0.70),
                "status": "AVAILABLE",
                "created_at": firestore.SERVER_TIMESTAMP
            }

            db.collection("resale_items").add(resale_item)
            resale_created = True

        # 🌱 Eco points penalty logic
        penalty_points = 10
        current_points = user_data.get("eco_points", 0)
        current_lifetime = user_data.get("lifetime_eco_points", 0)

        actual_penalty = min(current_points, penalty_points)
        new_balance = current_points - actual_penalty

        # optional lifetime penalty for abuse control
        lifetime_after_penalty = max(0, current_lifetime - actual_penalty)

        if lifetime_after_penalty >= 300:
            new_tier = "PLANET_HERO"
        elif lifetime_after_penalty >= 100:
            new_tier = "GREEN"
        else:
            new_tier = "SEED"

        retained_amount = total_amount - refund_amount

        batch = db.batch()

        batch.update(order_ref, {
            "status": "CANCELLED",
            "cancelled_at": firestore.SERVER_TIMESTAMP,
            "cancellation_reason": "User requested",
            "eco_points_deducted": actual_penalty,
            "refund": {
                "eligible": refund_amount > 0,
                "amount": refund_amount,
                "type": refund_type,
                "status": refund_status,
                "razorpay_refund_id": refund_id
            },
            "staff_payout": {
                "amount": retained_amount,
                "status": "PENDING"
            },
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        user_ref = db.collection("users").document(user_uid)

        batch.update(user_ref, {
            "eco_points": new_balance,
            "lifetime_eco_points": lifetime_after_penalty,
            "tier": new_tier,
            "cancellations_this_week": current_count + 1,
            "cancellation_week_start": week_start,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        batch.commit()

        msg = "Order cancelled."
        if resale_created:
            msg += " Item added to discounted feed."

        return JSONResponse(
            status_code=200,
            content={
                "message": msg,
                "resale_created": resale_created,
                "refund_id": refund_id,
                "refund_amount": refund_amount,
                "eco_points_deducted": actual_penalty,
                "new_tier": new_tier
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

  async def buy_resale_item(self, resale_id: str, id_token: str):
    try:
      user_data, user_uid = await self.get_user_details(id_token)
      if not user_data:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})

      resale_ref = db.collection("resale_items").document(resale_id)

      if resale_ref.get("original_user_id") == user_uid:
        raise Exception("You cannot purchase your own cancelled order.")

      transaction = db.transaction()

      @firestore.transactional
      def reserve_item_transaction(transaction, resale_ref):
        snapshot = resale_ref.get(transaction=transaction)

        if not snapshot.exists:
          raise Exception("Item not found")

        data = snapshot.to_dict()
        current_status = data.get("status")
        last_updated = data.get("reserved_at")

        is_available = (current_status == "AVAILABLE")

        if current_status == "RESERVED" and last_updated:
          reservation_time = last_updated
          if now - reservation_time.replace(tzinfo=None) > timedelta(minutes=5):
            is_available = True

        if not is_available:
          raise Exception("Item is currently being purchased by someone else.")

        transaction.update(resale_ref, {
          "status": "RESERVED",
          "reserved_by": user_uid,
          "reserved_at": firestore.SERVER_TIMESTAMP
        })

        return data

      try:
        now = datetime.now()
        resale_data = reserve_item_transaction(transaction, resale_ref)

        discounted_price = resale_data.get("discounted_price", 0)

        user_snapshot = {
          "name": user_data.get("name", "Unknown"),
          "phone": user_data.get("phone", "")
        }

        new_order_ref = db.collection('orders').document()
        internal_order_id = new_order_ref.id

        firestore_order_data = {
          "user_id": user_uid,
          "user_details": user_snapshot,
          "stall_id": resale_data.get("stall_id"),
          "stall_name": resale_data.get("stall_name"),
          "college_id": resale_data.get("college_id"),
          "items": resale_data.get("items", []),
          "total_amount": discounted_price,
          "status": "PENDING",
          "order_type": "RESALE",
          "resale_item_ref": resale_id,
          "created_at": firestore.SERVER_TIMESTAMP,
          "updated_at": firestore.SERVER_TIMESTAMP
        }

        payment_payload = {
          "amount": int(discounted_price * 100),
          "currency": "INR",
          "receipt": f"resale_{internal_order_id[:8]}",
          "notes": {
            "stall_id": resale_data.get("stall_id"),
            "user_uid": user_uid,
            "college_id": resale_data.get("college_id"),
            "internal_order_id": internal_order_id,
            "type": "RESALE",
            "resale_item_id": resale_id
          }
        }

        razorpay_order = self.razorpay_client.order.create(data=payment_payload)

        firestore_order_data["razorpay_order_id"] = razorpay_order['id']

        new_order_ref.set(firestore_order_data)

        return JSONResponse(
          status_code=200,
          content={
            "id": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency": razorpay_order['currency'],
            "key_id": os.environ.get("RAZORPAY_KEY_ID"),
            "internal_order_id": internal_order_id,
            "message": "Item reserved. Please complete payment in 5 minutes."
          }
        )

      except Exception as e:
        return JSONResponse(status_code=409, content={"message": str(e)})

    except Exception as e:
      return JSONResponse(status_code=500, content={"message": str(e)})

  async def get_discounted_feed(self, id_token: str):
    try:
      user_data, _ = await self.get_user_details(id_token)
      if not user_data:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})

      college_id = user_data.get("college_id")
      now = datetime.now()

      resale_ref = (
        db.collection("resale_items")
        .where("college_id", "==", college_id)
        .where("status", "in", ["AVAILABLE", "RESERVED"])
        .order_by("created_at", direction=firestore.Query.DESCENDING)
      )

      docs = resale_ref.stream()

      feed_items = []
      for doc in docs:
        data = doc.to_dict()

        if data.get("status") == "RESERVED":
          reserved_at = data.get("reserved_at")
          if reserved_at and (now - reserved_at.replace(tzinfo=None)) < timedelta(minutes=5):
            continue

        data["resale_id"] = doc.id
        data = self.serialize_firestore_data(data)
        feed_items.append(data)

      return JSONResponse(status_code=200, content=feed_items)

    except Exception as e:
      return JSONResponse(status_code=500, content={"message": str(e)})