import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


# Initialize Firebase app and Firestore client
_cred_path = Path(__file__).resolve().parents[1] / "firebase-service-account.json"
if not firebase_admin._apps:
    cred = credentials.Certificate(str(_cred_path))
    firebase_admin.initialize_app(cred)

db = firestore.client()