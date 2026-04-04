# app/core/config.py

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FIREBASE_SERVICE_ACCOUNT = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    IS_CI = os.environ.get("CI") == "true"
    RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")
    RAZORPAY_WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
    SENDGRID_FROM_EMAIL = os.environ.get("SENDGRID_FROM_EMAIL")
    FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL")

settings = Settings()