from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.firebase import db
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


@router.get("/")
def get_product_requests():

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


@router.get("/{request_id}")
def get_product_request(request_id: str):

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