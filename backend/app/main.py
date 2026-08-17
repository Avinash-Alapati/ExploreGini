from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.services.embedding import load_model
from app.routes import companies, search, filters, stats

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

app = FastAPI(
    title="openDB API",
    description="Backend API for openDB - a YC company open database.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies.router)
app.include_router(search.router)
app.include_router(filters.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {"message": "openDB API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
