from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.firebase import db
from app.auth import verify_admin

router = APIRouter(
    prefix="/api/services",
    tags=["Services"]
)


class Service(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image: str | None = None


# =========================
# PUBLIC APIs
# =========================

@router.get("/")
def get_services():
    services = []

    docs = db.collection("services").stream()

    for doc in docs:
        service = doc.to_dict()
        service["id"] = doc.id
        services.append(service)

    return services


@router.get("/{service_id}")
def get_service(service_id: str):
    doc_ref = db.collection("services").document(service_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    service = doc.to_dict()
    service["id"] = doc.id

    return service


# =========================
# ADMIN APIs
# =========================

@router.post("/")
def create_service(
    service: Service,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document()

    service_data = service.model_dump()

    doc_ref.set(service_data)

    return {
        "message": "Service created successfully",
        "id": doc_ref.id,
        "service": service_data
    }


@router.put("/{service_id}")
def update_service(
    service_id: str,
    service: Service,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document(service_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    service_data = service.model_dump()

    doc_ref.update(service_data)

    return {
        "message": "Service updated successfully",
        "id": service_id,
        "service": service_data
    }


@router.delete("/{service_id}")
def delete_service(
    service_id: str,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document(service_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    doc_ref.delete()

    return {
        "message": "Service deleted successfully",
        "id": service_id
    }