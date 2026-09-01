from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.firebase import db
from datetime import datetime, timezone

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"]
)


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    subject: str | None = None
    message: str


@router.post("/")
def create_contact_message(contact: ContactMessage):

    doc_ref = db.collection("contactMessages").document()

    contact_data = contact.model_dump()

    contact_data["status"] = "unread"
    contact_data["created_at"] = datetime.now(timezone.utc)

    doc_ref.set(contact_data)

    return {
        "message": "Contact message submitted successfully",
        "id": doc_ref.id
    }


@router.get("/")
def get_contact_messages():

    messages = []

    docs = (
        db.collection("contactMessages")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    for doc in docs:
        message_data = doc.to_dict()
        message_data["id"] = doc.id
        messages.append(message_data)

    return messages


@router.get("/{message_id}")
def get_contact_message(message_id: str):

    doc_ref = db.collection("contactMessages").document(message_id)
    doc = doc_ref.get()

    if not doc.exists:
        return {
            "message": "Contact message not found"
        }

    message_data = doc.to_dict()
    message_data["id"] = doc.id

    return message_data