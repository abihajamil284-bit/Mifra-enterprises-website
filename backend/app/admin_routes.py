from fastapi import APIRouter, Depends
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

        # Only active products count
        # Default is True if field doesn't exist
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

        # Recent requests
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

        # Add service requests to recent list
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