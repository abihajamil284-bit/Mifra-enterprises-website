from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.firebase import db

router = APIRouter(prefix="/api/products", tags=["products"])


class Product(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image: str | None = None


@router.post("/")
def create_product(product: Product):
    doc_ref = db.collection("products").document()

    product_data = product.model_dump()

    doc_ref.set(product_data)

    return {
        "message": "Product created successfully",
        "id": doc_ref.id,
        "product": product_data,
    }


@router.get("/")
def get_products():
    products = []

    docs = db.collection("products").stream()

    for doc in docs:
        product = doc.to_dict()
        product["id"] = doc.id
        products.append(product)

    return products


@router.get("/{product_id}")
def get_product(product_id: str):
    doc_ref = db.collection("products").document(product_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")

    product = doc.to_dict()
    product["id"] = doc.id

    return product


@router.put("/{product_id}")
def update_product(product_id: str, product: Product):
    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")

    product_data = product.model_dump()

    doc_ref.update(product_data)

    return {"message": "Product updated successfully", "id": product_id, "product": product_data}


@router.delete("/{product_id}")
def delete_product(product_id: str):
    doc_ref = db.collection("products").document(product_id)

    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Product not found")

    doc_ref.delete()

    return {"message": "Product deleted successfully", "id": product_id}