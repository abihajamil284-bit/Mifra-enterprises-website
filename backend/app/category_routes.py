from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.firebase import db

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)


class Category(BaseModel):
    name: str
    description: str | None = None
    image: str | None = None


@router.post("/")
def create_category(category: Category):
    doc_ref = db.collection("productCategories").document()

    category_data = category.model_dump()
    doc_ref.set(category_data)

    return {
        "message": "Category created successfully",
        "id": doc_ref.id,
        "category": category_data
    }


@router.get("/")
def get_categories():
    categories = []

    docs = db.collection("productCategories").stream()

    for doc in docs:
        category = doc.to_dict()
        category["id"] = doc.id
        categories.append(category)

    return categories


@router.get("/{category_id}")
def get_category(category_id: str):
    doc_ref = db.collection("productCategories").document(category_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    category = doc.to_dict()
    category["id"] = doc.id

    return category


@router.put("/{category_id}")
def update_category(category_id: str, category: Category):
    doc_ref = db.collection("productCategories").document(category_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    category_data = category.model_dump()
    doc_ref.update(category_data)

    return {
        "message": "Category updated successfully",
        "id": category_id,
        "category": category_data
    }


@router.delete("/{category_id}")
def delete_category(category_id: str):
    doc_ref = db.collection("productCategories").document(category_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    doc_ref.delete()

    return {
        "message": "Category deleted successfully",
        "id": category_id
    }