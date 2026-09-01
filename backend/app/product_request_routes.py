from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.firebase import db
from app.auth import verify_admin
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
    quantity: int
    message: str | None = None


class ProductRequestStatus(BaseModel):
    status: str


# ==========================================
# CREATE PRODUCT REQUEST - PUBLIC
# ==========================================

@router.post("/")
def create_product_request(request: ProductRequest):

    # Check whether requested product exists
    product_ref = db.collection("products").document(request.product_id)
    product_doc = product_ref.get()

    if not product_doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    doc_ref = db.collection("productRequests").document()

    request_data = request.model_dump()

    request_data["status"] = "new"
    request_data["created_at"] = datetime.now(timezone.utc)

    doc_ref.set(request_data)

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