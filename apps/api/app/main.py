from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.upload import router as upload_router
from app.api.routes.classify import router as classify_router
from app.api.routes.export import router as export_router
from app.api.routes.corrections import router as corrections_router
from app.core.config import settings

app = FastAPI(
    title="Listino Pronto API",
    description="AI-driven ETIM BMEcat and Metel ECP catalog converter for the Italian electrical distribution market",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/v1", tags=["upload"])
app.include_router(classify_router, prefix="/api/v1", tags=["classify"])
app.include_router(export_router, prefix="/api/v1", tags=["export"])
app.include_router(corrections_router, prefix="/api/v1", tags=["corrections"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "listino-pronto-api",
        "environment": settings.environment,
    }
