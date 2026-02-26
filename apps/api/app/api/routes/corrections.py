from fastapi import APIRouter

from app.schemas.catalog import CorrectionRequest, CorrectionResponse

router = APIRouter()

# In-memory store for development. In production, this would be PostgreSQL.
_corrections: list[dict] = []
_next_id = 1


@router.post("/corrections", response_model=CorrectionResponse)
async def save_correction(request: CorrectionRequest):
    global _next_id
    correction = {
        "id": _next_id,
        "tenant_id": request.tenant_id,
        "original_description": request.original_description,
        "correct_etim_class": request.correct_etim_class,
        "verified_features": [f.model_dump() for f in request.verified_features],
    }
    _corrections.append(correction)
    cid = _next_id
    _next_id += 1
    return CorrectionResponse(id=cid, status="saved")


@router.get("/corrections/{tenant_id}")
async def get_corrections(tenant_id: str):
    return [c for c in _corrections if c["tenant_id"] == tenant_id]
