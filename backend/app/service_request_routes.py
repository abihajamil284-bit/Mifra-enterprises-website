from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.firebase import db
from datetime import datetime, timezone

router = APIRouter(
    prefix="/api/service-requests",
    tags=["Service Requests"]
)


class ServiceRequest(BaseModel):
    service_id: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    message: str | None = None


@router.post("/")
def create_service_request(request: ServiceRequest):

    # Check whether requested service exists
    service_ref = db.collection("services").document(request.service_id)
    service_doc = service_ref.get()

    if not service_doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    doc_ref = db.collection("serviceRequests").document()

    request_data = request.model_dump()

    request_data["status"] = "new"
    request_data["created_at"] = datetime.now(timezone.utc)

    doc_ref.set(request_data)

    return {
        "message": "Service request submitted successfully",
        "id": doc_ref.id
    }


@router.get("/")
def get_service_requests():

    requests = []

    docs = (
        db.collection("serviceRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in docs:
        request_data = doc.to_dict()
        request_data["id"] = doc.id
        requests.append(request_data)

    return requests


@router.get("/{request_id}")
def get_service_request(request_id: str):

    doc_ref = db.collection("serviceRequests").document(request_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    request_data = doc.to_dict()
    request_data["id"] = doc.id

    return request_data