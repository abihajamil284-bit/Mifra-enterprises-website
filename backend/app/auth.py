import logging

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.firebase import db


logger = logging.getLogger(__name__)
security = HTTPBearer(auto_error=False)


def verify_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security)
):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required")

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

    except (auth.InvalidIdTokenError, auth.ExpiredIdTokenError, auth.RevokedIdTokenError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    except HTTPException:
        raise

    except Exception:
        logger.exception("Unexpected failure while verifying admin access")
        raise HTTPException(status_code=500, detail="Authentication service unavailable")