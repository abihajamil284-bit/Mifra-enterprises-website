from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.firebase import db


security = HTTPBearer()


def verify_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token)

        uid = decoded_token["uid"]

        admin_ref = db.collection("admins").document(uid)
        admin_doc = admin_ref.get()

        if not admin_doc.exists:
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )

        admin_data = admin_doc.to_dict()

        if admin_data.get("role") != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )

        return decoded_token

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )