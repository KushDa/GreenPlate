# app/core/firebase.py

import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings

if not settings.FIREBASE_SERVICE_ACCOUNT and not settings.IS_CI:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT env variable not set")

if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT)
    firebase_admin.initialize_app(cred)

db = firestore.client()