from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.firebase import db
from app.auth import verify_admin
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


class ServiceRequestStatus(BaseModel):
    status: str


# ==========================================
# CREATE SERVICE REQUEST - PUBLIC
# ==========================================

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


# ==========================================
# GET ALL SERVICE REQUESTS - ADMIN
# ==========================================

@router.get("/")
def get_service_requests(
    admin=Depends(verify_admin)
):

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


# ==========================================
# GET SINGLE SERVICE REQUEST - ADMIN
# ==========================================

@router.get("/{request_id}")
def get_service_request(
    request_id: str,
    admin=Depends(verify_admin)
):

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


# ==========================================
# UPDATE SERVICE REQUEST STATUS - ADMIN
# ==========================================

@router.put("/{request_id}")
def update_service_request(
    request_id: str,
    request: ServiceRequestStatus,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("serviceRequests").document(request_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    allowed_statuses = [
        "new",
        "contacted",
        "in_progress",
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
        "message": "Service request status updated successfully",
        "id": request_id,
        "status": request.status
    }


# ==========================================
# DELETE SERVICE REQUEST - ADMIN
# ==========================================

@router.delete("/{request_id}")
def delete_service_request(
    request_id: str,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("serviceRequests").document(request_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    doc_ref.delete()

    return {
        "message": "Service request deleted successfully",
        "id": request_id
    }