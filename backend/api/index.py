import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Fix imports for Vercel serverless
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import engine, Base
from app.routes import products, customers, orders

# Retry DB connection on startup
for i in range(5):
    try:
        Base.metadata.create_all(bind=engine)
        break
    except Exception:
        if i == 4:
            raise
        time.sleep(1)

app = FastAPI(
    title="Inventory & Order Management System",
    description="API for managing products, customers, and orders",
    version="1.0.0",
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Inventory & Order Management System API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
