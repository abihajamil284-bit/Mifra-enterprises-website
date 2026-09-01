from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import verify_admin
from app.firebase import db

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# ==========================================
# ADMIN TEST
# ==========================================

@router.get("/test")
def admin_test(admin=Depends(verify_admin)):
    return {
        "message": "Admin authentication successful!",
        "uid": admin["uid"],
        "email": admin.get("email")
    }


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@router.get("/dashboard")
def get_admin_dashboard(admin=Depends(verify_admin)):

    # ------------------------------------------
    # PRODUCTS
    # ------------------------------------------

    products_docs = db.collection("products").stream()

    total_active_products = 0
    in_stock_products = 0
    low_stock_products = 0
    out_of_stock_products = 0

    for doc in products_docs:

        product = doc.to_dict()

        is_active = product.get("isActive", True)

        if not is_active:
            continue

        total_active_products += 1

        stock_quantity = product.get("stockQuantity", 0)
        low_stock_threshold = product.get("lowStockThreshold", 0)

        if stock_quantity == 0:
            out_of_stock_products += 1

        elif stock_quantity <= low_stock_threshold:
            low_stock_products += 1

        else:
            in_stock_products += 1

    # ------------------------------------------
    # PRODUCT REQUESTS
    # ------------------------------------------

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

    # ------------------------------------------
    # SERVICE REQUESTS
    # ------------------------------------------

    service_requests_docs = (
        db.collection("serviceRequests")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    pending_service_requests = 0

    for doc in service_requests_docs:

        request = doc.to_dict()

        status = request.get("status", "new")

        if status in ["new", "contacted", "in_progress"]:
            pending_service_requests += 1

        if len(recent_requests) < 5:
            request["id"] = doc.id
            request["request_type"] = "service"
            recent_requests.append(request)

    # ------------------------------------------
    # SORT RECENT REQUESTS
    # ------------------------------------------

    recent_requests.sort(
        key=lambda x: x.get("created_at"),
        reverse=True
    )

    recent_requests = recent_requests[:5]

    # ------------------------------------------
    # RESPONSE
    # ------------------------------------------

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
# ADMIN REQUESTS
# ==========================================

@router.get("/requests")
def get_admin_requests(admin=Depends(verify_admin)):

    requests = []

    # ------------------------------------------
    # PRODUCT REQUESTS
    # ------------------------------------------

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

    # ------------------------------------------
    # SERVICE REQUESTS
    # ------------------------------------------

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

    # ------------------------------------------
    # SORT BY CREATED DATE
    # ------------------------------------------

    requests.sort(
        key=lambda x: x.get("created_at"),
        reverse=True
    )

    return requests


# ==========================================
# REQUEST STATUS UPDATE MODEL
# ==========================================

class RequestStatusUpdate(BaseModel):
    status: str
    request_type: str


# ==========================================
# UPDATE REQUEST STATUS
# ==========================================

@router.put("/requests/{request_id}")
def update_admin_request(
    request_id: str,
    request: RequestStatusUpdate,
    admin=Depends(verify_admin)
):

    allowed_statuses = [
        "new",
        "contacted",
        "in_progress",
        "completed",
        "cancelled"
    ]

    # ------------------------------------------
    # VALIDATE STATUS
    # ------------------------------------------

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {allowed_statuses}"
        )

    # ------------------------------------------
    # VALIDATE REQUEST TYPE
    # ------------------------------------------

    if request.request_type not in ["product", "service"]:
        raise HTTPException(
            status_code=400,
            detail="request_type must be 'product' or 'service'"
        )

    # ------------------------------------------
    # SELECT COLLECTION
    # ------------------------------------------

    if request.request_type == "product":
        collection_name = "productRequests"
    else:
        collection_name = "serviceRequests"

    # ------------------------------------------
    # FIND REQUEST
    # ------------------------------------------

    doc_ref = db.collection(collection_name).document(request_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    # ------------------------------------------
    # UPDATE STATUS
    # ------------------------------------------

    doc_ref.update({
        "status": request.status
    })

    # ------------------------------------------
    # RESPONSE
    # ------------------------------------------

    return {
        "message": "Request status updated successfully",
        "id": request_id,
        "request_type": request.request_type,
        "status": request.status
    }