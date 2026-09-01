from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from app.firebase import db
from app.auth import verify_admin

router = APIRouter(
    prefix="/api/services",
    tags=["Services"]
)


class Service(BaseModel):
    name: str
    description: str
    price: float = Field(ge=0)
    category: str
    image: str | None = None
    isActive: bool = True
    featured: bool = False
    displayOrder: int = Field(default=0, ge=0)


class ServiceStatusUpdate(BaseModel):
    isActive: bool


class ServiceFeaturedUpdate(BaseModel):
    featured: bool


class ServiceOrderUpdate(BaseModel):
    displayOrder: int = Field(ge=0)


# =========================
# PUBLIC APIs
# =========================

@router.get("/")
def get_services():

    services = []

    docs = db.collection("services").stream()

    for doc in docs:

        service = doc.to_dict()

        # Only active services are publicly visible
        if service.get("isActive", True) is False:
            continue

        service["id"] = doc.id
        services.append(service)

    # Sort by display order
    services.sort(
        key=lambda x: x.get("displayOrder", 0)
    )

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

    # Inactive services should not be publicly accessible
    if service.get("isActive", True) is False:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    service["id"] = doc.id

    return service


# =========================
# ADMIN - CREATE
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


# =========================
# ADMIN - UPDATE
# =========================

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


# =========================
# ADMIN - ACTIVATE / DEACTIVATE
# =========================

@router.put("/{service_id}/status")
def update_service_status(
    service_id: str,
    status: ServiceStatusUpdate,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("services").document(service_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    doc_ref.update({
        "isActive": status.isActive
    })

    return {
        "message": "Service status updated successfully",
        "id": service_id,
        "isActive": status.isActive
    }


# =========================
# ADMIN - FEATURE / UNFEATURE
# =========================

@router.put("/{service_id}/featured")
def update_service_featured(
    service_id: str,
    featured: ServiceFeaturedUpdate,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("services").document(service_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    doc_ref.update({
        "featured": featured.featured
    })

    return {
        "message": "Service featured status updated successfully",
        "id": service_id,
        "featured": featured.featured
    }


# =========================
# ADMIN - REORDER
# =========================

@router.put("/{service_id}/order")
def update_service_order(
    service_id: str,
    order: ServiceOrderUpdate,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("services").document(service_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    doc_ref.update({
        "displayOrder": order.displayOrder
    })

    return {
        "message": "Service order updated successfully",
        "id": service_id,
        "displayOrder": order.displayOrder
    }


# =========================
# ADMIN - DELETE
# =========================

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