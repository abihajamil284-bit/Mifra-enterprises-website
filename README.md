# Mifra Enterprises Website

This repository contains the FastAPI backend for the MIFRA Enterprises website and admin panel.

## Backend overview

The backend currently includes:
- public product, category, service, and site settings read APIs
- public submission APIs for product requests, service requests, and contact messages
- admin APIs for products, services, requests, contact messages, dashboard, and settings
- Firebase Admin SDK authentication with Firestore-backed admin authorization
- SMTP email notifications for customer submissions
- per-IP rate limiting on public submission endpoints

## Documentation

The current API documentation is maintained in:
- [docs/API.md](docs/API.md)

## Backend setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Running tests

```bash
cd backend
python -m pytest -q tests/test_backend_suite.py
```

## Required environment variables

Set the following values in your environment before running the service:

- `CORS_ORIGINS`
- `RATE_LIMIT_REQUESTS`
- `RATE_LIMIT_WINDOW_SECONDS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_TO_EMAIL`
- `ADMIN_EMAIL`
- `SMTP_USE_TLS`
- `SMTP_USE_SSL`

Do not store secrets in source code.