from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, Field
from app.firebase import db
from app.auth import verify_admin
from app.email_service import send_submission_notification
from app.rate_limit import rate_limit
from datetime import datetime, timezone

router = APIRouter(
    prefix="/api/product-requests",
    tags=["Product Requests"]
)


class ProductRequest(BaseModel):
    product_id: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    quantity: int = Field(ge=1)
    message: str | None = None


class ProductRequestStatus(BaseModel):
    status: str


# ==========================================
# CREATE PRODUCT REQUEST - PUBLIC
# ==========================================

@router.post("/")
def create_product_request(request: Request, payload: ProductRequest):
    rate_limit(request)

    # Check whether requested product exists
    product_ref = db.collection("products").document(payload.product_id)
    product_doc = product_ref.get()

    if not product_doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    doc_ref = db.collection("productRequests").document()

    request_data = payload.model_dump()

    request_data["status"] = "new"
    request_data["created_at"] = datetime.now(timezone.utc)

    doc_ref.set(request_data)

    send_submission_notification(
        subject="New product request received",
        message=(
            f"A new product request was submitted.\n\n"
            f"Customer: {payload.customer_name}\n"
            f"Email: {payload.customer_email}\n"
            f"Phone: {payload.customer_phone}\n"
            f"Product ID: {payload.product_id}\n"
            f"Quantity: {payload.quantity}\n"
            f"Message: {payload.message or 'None'}"
        ),
        recipient_email=str(payload.customer_email),
    )

    return {
        "message": "Product request submitted successfully",
        "id": doc_ref.id
    }


# ==========================================
# GET ALL PRODUCT REQUESTS - ADMIN
# ==========================================

@router.get("/")
def get_product_requests(admin=Depends(verify_admin)):

    requests = []

    docs = (
        db.collection("productRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in docs:
        request_data = doc.to_dict()
        request_data["id"] = doc.id
        requests.append(request_data)

    return requests


# ==========================================
# GET SINGLE PRODUCT REQUEST - ADMIN
# ==========================================

@router.get("/{request_id}")
def get_product_request(
    request_id: str,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("productRequests").document(request_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Product request not found"
        )

    request_data = doc.to_dict()
    request_data["id"] = doc.id

    return request_data


# ==========================================
# UPDATE PRODUCT REQUEST STATUS - ADMIN
# ==========================================

@router.put("/{request_id}")
def update_product_request(
    request_id: str,
    request: ProductRequestStatus,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("productRequests").document(request_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product request not found"
        )

    allowed_statuses = [
        "new",
        "contacted",
        "completed",
        "cancelled"
    ]

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {allowed_statuses}"
        )

    doc_ref.update({
        "status": request.status
    })

    return {
        "message": "Product request status updated successfully",
        "id": request_id,
        "status": request.status
    }


# ==========================================
# DELETE PRODUCT REQUEST - ADMIN
# ==========================================

@router.delete("/{request_id}")
def delete_product_request(
    request_id: str,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("productRequests").document(request_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product request not found"
        )

    doc_ref.delete()

    return {
        "message": "Product request deleted successfully",
        "id": request_id
    }