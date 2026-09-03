import json
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


# Initialize Firebase app and Firestore client
_cred_path = Path(__file__).resolve().parents[1] / "firebase-service-account.json"


def _get_credentials():
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_json:
        try:
            return credentials.Certificate(json.loads(service_account_json))
        except (json.JSONDecodeError, ValueError, TypeError):
            raise RuntimeError("Invalid Firebase service account configuration")

    if _cred_path.exists():
        return credentials.Certificate(str(_cred_path))

    raise RuntimeError("Firebase service account configuration is missing")


if not firebase_admin._apps:
    cred = _get_credentials()
    firebase_admin.initialize_app(cred)

db = firestore.client()