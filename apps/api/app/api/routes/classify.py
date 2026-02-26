from fastapi import APIRouter

from app.schemas.catalog import (
    ClassifyRequest,
    ClassifyResponse,
    MatchClassesRequest,
    MatchClassesResponse,
    MatchClassesResult,
    EtimCandidate,
)
from app.services.vector_search import search_etim_classes
from app.services.classifier import classify_batch

router = APIRouter()


@router.post("/match-classes", response_model=MatchClassesResponse)
async def match_classes(request: MatchClassesRequest):
    raw_results = await search_etim_classes(request.descriptions)
    results = []
    for r in raw_results:
        results.append(MatchClassesResult(
            description=r["description"],
            candidates=[
                EtimCandidate(**c) for c in r["candidates"]
            ],
        ))
    return MatchClassesResponse(results=results)


@router.post("/classify", response_model=ClassifyResponse)
async def classify(request: ClassifyRequest):
    results = await classify_batch(request.items)
    return ClassifyResponse(results=results)
