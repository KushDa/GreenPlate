#app/utils/mailer.py

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_staff_password_setup_email(to_email: str, reset_link: str):
    message = Mail(
        from_email=os.getenv("SENDGRID_FROM_EMAIL"),
        to_emails=to_email,
        subject="Set your GreenPlate password",
        html_content=f"""
        <html>
          <body style="font-family: Arial, sans-serif;">
            <p>You have been added as a staff member on <b>GreenPlate</b>.</p>

            <p>
              Click the button below to set your password:
            </p>

            <p>
              <a href="{reset_link}"
                 style="
                   display:inline-block;
                   padding:10px 16px;
                   background-color:#16a34a;
                   color:#ffffff;
                   text-decoration:none;
                   border-radius:6px;
                 ">
                Set Password
              </a>
            </p>

            <p style="font-size:12px;color:#666;">
              If the button does not work, copy and paste this link into your browser:
              <br />
              <span>{reset_link}</span>
            </p>
          </body>
        </html>
        """
    )

    sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
    sg.send(message)

def send_shelter_donation_email(to_email: str, shelter_name: str, donation_data: dict):
  subject = "Food Donation Available - GreenPlate"

  item_lines = "\n".join(
    [f"- {item['name']} x {item['quantity']}" for item in donation_data["items"]]
  )

  body = f"""
Hello {shelter_name},

A nearby stall has surplus food available for donation.

Stall: {donation_data['stall_name']}
Pickup Deadline: {donation_data['pickup_deadline']}

Items:
{item_lines}

Notes:
{donation_data.get('notes', 'N/A')}

Please arrange pickup as soon as possible.

- GreenPlate
"""

  message = Mail(
    from_email=os.getenv("SENDGRID_FROM_EMAIL"),
    to_emails=to_email,
    subject=subject,
    plain_text_content=body
  )
  sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
  sg.send(message)
