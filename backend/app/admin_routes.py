from fastapi import APIRouter, Depends
from app.auth import verify_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(admin=Depends(verify_admin)):
    return {
        "message": "Admin authentication successful!",
        "uid": admin["uid"],
        "email": admin.get("email")
    }