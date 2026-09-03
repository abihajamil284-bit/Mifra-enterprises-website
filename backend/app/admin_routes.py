from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.auth import verify_admin
from app.firebase import db

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

ALLOWED_REQUEST_STATUSES = [
    "new",
    "contacted",
    "in_progress",
    "completed",
    "cancelled"
]
ALLOWED_MESSAGE_STATUSES = ["read", "unread"]


def get_stock_status(stock_quantity: int, low_stock_threshold: int) -> str:
    if stock_quantity == 0:
        return "out_of_stock"
    if 0 < stock_quantity <= low_stock_threshold:
        return "limited_stock"
    return "in_stock"


# ==========================================
# ADMIN TEST
# ==========================================

@router.get("/test")
def admin_test(admin=Depends(verify_admin)):
    return {
        "message": "Admin authentication successful"
    }


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@router.get("/dashboard")
def get_admin_dashboard(admin=Depends(verify_admin)):

    products_docs = db.collection("products").stream()

    total_active_products = 0
    in_stock_products = 0
    low_stock_products = 0
    out_of_stock_products = 0

    for doc in products_docs:
        product = doc.to_dict()

        if product.get("isActive", True) is False:
            continue

        total_active_products += 1

        stock_quantity = product.get("stockQuantity", 0)
        low_stock_threshold = product.get("lowStockThreshold", 0)

        stock_status = get_stock_status(stock_quantity, low_stock_threshold)

        if stock_status == "out_of_stock":
            out_of_stock_products += 1
        elif stock_status == "limited_stock":
            low_stock_products += 1
        else:
            in_stock_products += 1

    product_requests_docs = (
        db.collection("productRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    pending_product_requests = 0
    recent_requests = []

    for doc in product_requests_docs:
        request = doc.to_dict()
        request["id"] = doc.id
        status = request.get("status", "new")

        if status in ["new", "contacted", "in_progress"]:
            pending_product_requests += 1

        if len(recent_requests) < 5:
            request["request_type"] = "product"
            recent_requests.append(request)

    service_requests_docs = (
        db.collection("serviceRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    pending_service_requests = 0

    for doc in service_requests_docs:
        request = doc.to_dict()
        request["id"] = doc.id
        status = request.get("status", "new")

        if status in ["new", "contacted", "in_progress"]:
            pending_service_requests += 1

        if len(recent_requests) < 5:
            request["request_type"] = "service"
            recent_requests.append(request)

    recent_requests.sort(key=lambda x: x.get("created_at"), reverse=True)
    recent_requests = recent_requests[:5]

    return {
        "products": {
            "total_active": total_active_products,
            "in_stock": in_stock_products,
            "low_stock": low_stock_products,
            "out_of_stock": out_of_stock_products
        },
        "requests": {
            "pending_product": pending_product_requests,
            "pending_service": pending_service_requests
        },
        "recent_requests": recent_requests
    }


# ==========================================
# ADMIN PRODUCT MODELS
# ==========================================

class AdminProduct(BaseModel):
    name: str
    description: str
    price: float = Field(ge=0)
    category: str
    image: str | None = None
    stockQuantity: int = Field(default=0, ge=0)
    lowStockThreshold: int = Field(default=5, ge=0)
    isActive: bool = True
    featured: bool = False


class AdminProductStockUpdate(BaseModel):
    stockQuantity: int = Field(ge=0)
    lowStockThreshold: int | None = Field(default=None, ge=0)


class ProductStatusUpdate(BaseModel):
    isActive: bool


# ==========================================
# GET PRODUCTS
# ==========================================

@router.get("/products")
def get_admin_products(admin=Depends(verify_admin)):
    products = []

    docs = db.collection("products").order_by("name").stream()

    for doc in docs:
        product = doc.to_dict()
        product["id"] = doc.id
        product["stockStatus"] = get_stock_status(
            product.get("stockQuantity", 0),
            product.get("lowStockThreshold", 0)
        )
        products.append(product)

    return products


# ==========================================
# CREATE PRODUCT
# ==========================================

@router.post("/products")
def create_admin_product(
    product: AdminProduct,
    admin=Depends(verify_admin)
):
    category_ref = db.collection("productCategories").document(product.category)
    if not category_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")

    doc_ref = db.collection("products").document()
    product_data = product.model_dump()
    product_data["created_at"] = datetime.now(timezone.utc)
    product_data["updated_at"] = datetime.now(timezone.utc)

    doc_ref.set(product_data)

    return {
        "message": "Product created successfully",
        "id": doc_ref.id,
        "product": product_data
    }


# ==========================================
# UPDATE PRODUCT
# ==========================================

@router.put("/products/{product_id}")
def update_admin_product(
    product_id: str,
    product: AdminProduct,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("products").document(product_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")

    category_ref = db.collection("productCategories").document(product.category)
    if not category_ref.get().exists:
        raise HTTPException(status_code=404, detail="Category not found")

    product_data = product.model_dump()
    product_data["updated_at"] = datetime.now(timezone.utc)
    doc_ref.update(product_data)

    return {
        "message": "Product updated successfully",
        "id": product_id,
        "product": product_data
    }


# ==========================================
# DELETE / SOFT DELETE PRODUCT
# ==========================================

@router.delete("/products/{product_id}")
def delete_admin_product(
    product_id: str,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("products").document(product_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")

    doc_ref.update({
        "isActive": False,
        "deletedAt": datetime.now(timezone.utc)
    })

    return {
        "message": "Product deactivated successfully",
        "id": product_id
    }


# ==========================================
# UPDATE PRODUCT STATUS
# ==========================================

@router.put("/products/{product_id}/status")
def update_admin_product_status(
    product_id: str,
    status: ProductStatusUpdate,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("products").document(product_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")

    doc_ref.update({
        "isActive": status.isActive,
        "updated_at": datetime.now(timezone.utc)
    })

    return {
        "message": "Product status updated successfully",
        "id": product_id,
        "isActive": status.isActive
    }


# ==========================================
# UPDATE PRODUCT STOCK
# ==========================================

@router.put("/products/{product_id}/stock")
def update_admin_product_stock(
    product_id: str,
    stock: AdminProductStockUpdate,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("products").document(product_id)
    product_doc = doc_ref.get()

    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")

    product = product_doc.to_dict()
    existing_threshold = product.get("lowStockThreshold", 0)
    threshold = stock.lowStockThreshold if stock.lowStockThreshold is not None else existing_threshold

    update_data = {
        "stockQuantity": stock.stockQuantity,
        "lowStockThreshold": threshold,
        "stockStatus": get_stock_status(stock.stockQuantity, threshold),
        "updated_at": datetime.now(timezone.utc)
    }

    doc_ref.update(update_data)

    return {
        "message": "Product stock updated successfully",
        "id": product_id,
        "stockQuantity": stock.stockQuantity,
        "lowStockThreshold": threshold,
        "stockStatus": update_data["stockStatus"]
    }


# ==========================================
# ADMIN SERVICE MODELS
# ==========================================

class AdminService(BaseModel):
    name: str
    description: str
    price: float = Field(ge=0)
    category: str
    image: str | None = None
    isActive: bool = True
    featured: bool = False
    displayOrder: int = Field(default=0, ge=0)


# ==========================================
# CREATE SERVICE
# ==========================================

@router.post("/services")
def create_admin_service(
    service: AdminService,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document()
    service_data = service.model_dump()
    service_data["created_at"] = datetime.now(timezone.utc)
    service_data["updated_at"] = datetime.now(timezone.utc)

    doc_ref.set(service_data)

    return {
        "message": "Service created successfully",
        "id": doc_ref.id,
        "service": service_data
    }


# ==========================================
# UPDATE SERVICE
# ==========================================

@router.put("/services/{service_id}")
def update_admin_service(
    service_id: str,
    service: AdminService,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document(service_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Service not found")

    service_data = service.model_dump()
    service_data["updated_at"] = datetime.now(timezone.utc)
    doc_ref.update(service_data)

    return {
        "message": "Service updated successfully",
        "id": service_id,
        "service": service_data
    }


# ==========================================
# DELETE / SOFT DELETE SERVICE
# ==========================================

@router.delete("/services/{service_id}")
def delete_admin_service(
    service_id: str,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("services").document(service_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Service not found")

    doc_ref.update({
        "isActive": False,
        "deletedAt": datetime.now(timezone.utc)
    })

    return {
        "message": "Service deactivated successfully",
        "id": service_id
    }


# ==========================================
# ADMIN REQUESTS
# ==========================================

@router.get("/requests")
def get_admin_requests(admin=Depends(verify_admin)):
    requests = []

    product_docs = (
        db.collection("productRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in product_docs:
        request = doc.to_dict()
        request["id"] = doc.id
        request["request_type"] = "product"
        requests.append(request)

    service_docs = (
        db.collection("serviceRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in service_docs:
        request = doc.to_dict()
        request["id"] = doc.id
        request["request_type"] = "service"
        requests.append(request)

    requests.sort(key=lambda x: x.get("created_at"), reverse=True)
    return requests


# ==========================================
# REQUEST STATUS UPDATE MODEL
# ==========================================

class RequestStatusUpdate(BaseModel):
    status: str
    request_type: str | None = None
    internal_notes: str | None = None


# ==========================================
# UPDATE REQUEST STATUS
# ==========================================

@router.put("/requests/{request_id}")
def update_admin_request(
    request_id: str,
    request: RequestStatusUpdate,
    admin=Depends(verify_admin)
):
    if request.status not in ALLOWED_REQUEST_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {ALLOWED_REQUEST_STATUSES}"
        )

    collection_name = request.request_type
    if collection_name not in ["product", "service"]:
        for candidate in ["product", "service"]:
            collection_name = candidate
            doc_ref = db.collection(f"{candidate}Requests").document(request_id)
            if doc_ref.get().exists:
                break
            collection_name = None

        if collection_name is None:
            raise HTTPException(status_code=404, detail="Request not found")
    else:
        collection_name = f"{request.request_type}Requests"
        doc_ref = db.collection(collection_name).document(request_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Request not found")

    update_data = {"status": request.status}
    if request.internal_notes is not None:
        update_data["internal_notes"] = request.internal_notes

    doc_ref.update(update_data)

    request_type = "product" if collection_name == "productRequests" else "service"

    return {
        "message": "Request status updated successfully",
        "id": request_id,
        "request_type": request_type,
        "status": request.status,
        "internal_notes": request.internal_notes
    }


# ==========================================
# ADMIN MESSAGE MODELS
# ==========================================

class MessageStatusUpdate(BaseModel):
    status: str


# ==========================================
# GET CONTACT MESSAGES
# ==========================================

@router.get("/messages")
def get_admin_messages(admin=Depends(verify_admin)):
    messages = []

    docs = (
        db.collection("contactMessages")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in docs:
        message = doc.to_dict()
        message["id"] = doc.id
        messages.append(message)

    return messages


# ==========================================
# UPDATE MESSAGE STATUS
# ==========================================

@router.put("/messages/{message_id}")
def update_admin_message(
    message_id: str,
    status_update: MessageStatusUpdate,
    admin=Depends(verify_admin)
):
    if status_update.status not in ALLOWED_MESSAGE_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {ALLOWED_MESSAGE_STATUSES}"
        )

    doc_ref = db.collection("contactMessages").document(message_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Contact message not found")

    doc_ref.update({"status": status_update.status})

    return {
        "message": "Contact message status updated successfully",
        "id": message_id,
        "status": status_update.status
    }


# ==========================================
# ADMIN SETTINGS MODELS
# ==========================================

class SiteSettingsUpdate(BaseModel):
    company_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    logo: str | None = None
    about_text: str | None = None
    facebook: str | None = None
    instagram: str | None = None
    whatsapp: str | None = None


# ==========================================
# UPDATE SITE SETTINGS
# ==========================================

@router.put("/settings")
def update_admin_settings(
    settings: SiteSettingsUpdate,
    admin=Depends(verify_admin)
):
    doc_ref = db.collection("siteSettings").document("main")
    settings_data = settings.model_dump(exclude_unset=True)

    if not settings_data:
        raise HTTPException(status_code=400, detail="No settings provided to update")

    settings_data["updated_at"] = datetime.now(timezone.utc)
    doc_ref.set(settings_data, merge=True)

    return {
        "message": "Site settings updated successfully",
        "id": "main",
        "settings": settings_data
    }