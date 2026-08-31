from fastapi import FastAPI
from app.product_routes import router as product_router
from app.service_routes import router as service_router

app = FastAPI(
    title="Mifra Enterprises API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Mifra Enterprises API is running!"
    }


@app.get("/home")
def home():
    return {
        "message": "FastAPI + firebase connected!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }


app.include_router(product_router)
app.include_router(service_router)