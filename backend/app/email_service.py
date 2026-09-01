import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def _get_email_config():
    smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").strip().lower() in {"1", "true", "yes", "on"}
    smtp_use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().lower() in {"1", "true", "yes", "on"}

    return {
        "host": os.getenv("SMTP_HOST"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "username": os.getenv("SMTP_USERNAME"),
        "password": os.getenv("SMTP_PASSWORD"),
        "from_email": os.getenv("SMTP_FROM_EMAIL"),
        "to_email": os.getenv("SMTP_TO_EMAIL") or os.getenv("ADMIN_EMAIL") or os.getenv("SMTP_FROM_EMAIL"),
        "use_tls": smtp_use_tls,
        "use_ssl": smtp_use_ssl,
    }


def send_submission_notification(subject: str, message: str, recipient_email: str | None = None) -> bool:
    config = _get_email_config()

    if not config["host"] or not config["from_email"]:
        logger.warning(
            "Email notifications are disabled because SMTP_HOST and SMTP_FROM_EMAIL are not configured."
        )
        return False

    recipient = recipient_email or config["to_email"]
    if not recipient:
        logger.warning(
            "Email notifications are disabled because no SMTP_TO_EMAIL or ADMIN_EMAIL recipient is configured."
        )
        return False

    email = EmailMessage()
    email["Subject"] = subject
    email["From"] = config["from_email"]
    email["To"] = recipient
    email.set_content(message)

    try:
        if config["use_ssl"]:
            with smtplib.SMTP_SSL(config["host"], config["port"]) as server:
                if config["username"] and config["password"]:
                    server.login(config["username"], config["password"])
                server.send_message(email)
        else:
            with smtplib.SMTP(config["host"], config["port"]) as server:
                if config["use_tls"]:
                    server.starttls()
                if config["username"] and config["password"]:
                    server.login(config["username"], config["password"])
                server.send_message(email)

        logger.info("Submission email sent successfully to %s", recipient)
        return True
    except Exception:
        logger.exception("Failed to send submission notification email to %s", recipient)
        return False
