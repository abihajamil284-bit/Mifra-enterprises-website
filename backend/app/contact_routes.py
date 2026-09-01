from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.firebase import db
from app.auth import verify_admin
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


class MessageStatusUpdate(BaseModel):
    status: str


# ==========================================
# PUBLIC - CREATE CONTACT MESSAGE
# ==========================================

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


# ==========================================
# ADMIN - GET ALL CONTACT MESSAGES
# ==========================================

@router.get("/")
def get_contact_messages(admin=Depends(verify_admin)):

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


# ==========================================
# ADMIN - GET SINGLE CONTACT MESSAGE
# ==========================================

@router.get("/{message_id}")
def get_contact_message(
    message_id: str,
    admin=Depends(verify_admin)
):

    doc_ref = db.collection("contactMessages").document(message_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=404,
            detail="Contact message not found"
        )

    message_data = doc.to_dict()
    message_data["id"] = doc.id

    return message_data


# ==========================================
# ADMIN - UPDATE MESSAGE STATUS
# ==========================================

@router.put("/{message_id}")
def update_contact_message_status(
    message_id: str,
    status: MessageStatusUpdate,
    admin=Depends(verify_admin)
):

    allowed_statuses = [
        "unread",
        "read"
    ]

    if status.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {allowed_statuses}"
        )

    doc_ref = db.collection("contactMessages").document(message_id)

    if not doc_ref.get().exists:
        raise HTTPException(
            status_code=404,
            detail="Contact message not found"
        )

    doc_ref.update({
        "status": status.status
    })

    return {
        "message": "Contact message status updated successfully",
        "id": message_id,
        "status": status.status
    }