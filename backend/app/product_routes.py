from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from app.firebase import db
from app.auth import verify_admin

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


class Product(BaseModel):
    name: str
    description: str
    price: float = Field(ge=0)
    category: str
    image: str | None = None
    stockQuantity: int = Field(default=0, ge=0)
    lowStockThreshold: int = Field(default=5, ge=0)
    isActive: bool = True


class StockUpdate(BaseModel):
    stockQuantity: int = Field(ge=0)


class ProductStatusUpdate(BaseModel):
    isActive: bool


# =========================
# PUBLIC APIs
# =========================

@router.get("/")
def get_products():

    products = []

    docs = db.collection("products").stream()

    for doc in docs:

        product = doc.to_dict()

        # Only active products are publicly visible
        if product.get("isActive", True) is False:
            continue

        product["id"] = doc.id
        products.append(product)

    return products


@router.get("/{product_id}")
def get_product(product_id: str):

    doc_ref = db.collection("products").document(product_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product = doc.to_dict()

    # Inactive products should not be publicly accessible
    if product.get("isActive", True) is False:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product["id"] = doc.id

    return product


# =========================
# ADMIN APIs
# =========================

@router.post("/")
def create_product(
    product: Product,
    admin=Depends(verify_admin)
):

    # Check category exists
    category_ref = db.collection("productCategories").document(
        product.category
    )

    category_doc = category_ref.get()

    if not category_doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    doc_ref = db.collection("products").document()

    product_data = product.model_dump()

    doc_ref.set(product_data)

    return {
        "message": "Product created successfully",
        "id": doc_ref.id,
        "product": product_data
    }


@router.put("/{product_id}")
def update_product(
    product_id: str,
    product: Product,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check category exists
    category_ref = db.collection("productCategories").document(
        product.category
    )

    category_doc = category_ref.get()

    if not category_doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    product_data = product.model_dump()

    doc_ref.update(product_data)

    return {
        "message": "Product updated successfully",
        "id": product_id,
        "product": product_data
    }


# =========================
# UPDATE STOCK
# =========================

@router.put("/{product_id}/stock")
def update_product_stock(
    product_id: str,
    stock: StockUpdate,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    doc_ref.update({
        "stockQuantity": stock.stockQuantity
    })

    return {
        "message": "Product stock updated successfully",
        "id": product_id,
        "stockQuantity": stock.stockQuantity
    }


# =========================
# ACTIVATE / DEACTIVATE
# =========================

@router.put("/{product_id}/status")
def update_product_status(
    product_id: str,
    status: ProductStatusUpdate,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    doc_ref.update({
        "isActive": status.isActive
    })

    return {
        "message": "Product status updated successfully",
        "id": product_id,
        "isActive": status.isActive
    }


# =========================
# DELETE PRODUCT
# =========================

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    doc_ref.delete()

    return {
        "message": "Product deleted successfully",
        "id": product_id
    }