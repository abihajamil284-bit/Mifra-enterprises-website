from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.firebase import db

router = APIRouter(
    prefix="/api/site-settings",
    tags=["Site Settings"]
)


class SiteSettings(BaseModel):
    company_name: str
    email: EmailStr
    phone: str
    address: str
    logo: str | None = None
    about_text: str | None = None
    facebook: str | None = None
    instagram: str | None = None
    whatsapp: str | None = None


SETTINGS_ID = "main"


@router.get("/")
def get_site_settings():
    doc_ref = db.collection("siteSettings").document(SETTINGS_ID)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Site settings not found"
        )

    settings = doc.to_dict()
    settings["id"] = doc.id

    return settings


@router.put("/")
def update_site_settings(settings: SiteSettings):
    doc_ref = db.collection("siteSettings").document(SETTINGS_ID)

    settings_data = settings.model_dump()

    doc_ref.set(settings_data, merge=True)

    return {
        "message": "Site settings updated successfully",
        "id": SETTINGS_ID,
        "settings": settings_data
    }