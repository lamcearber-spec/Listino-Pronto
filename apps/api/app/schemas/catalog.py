from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ProductStatus(str, Enum):
    PREREGISTERED = "10"
    ACTIVE = "20"
    AWAITING = "50"
    DELETED = "90"


class ExtractedFeature(BaseModel):
    feature_code: str = Field(..., description="ETIM feature code e.g. EF000227")
    feature_name: str = Field(..., description="Human-readable feature name")
    value: str | int | float = Field(..., description="Feature value")
    unit: Optional[str] = Field(None, description="Unit of measurement")


class EtimCandidate(BaseModel):
    class_id: str = Field(..., description="ETIM class code e.g. EC000042")
    class_name: str = Field(..., description="ETIM class name")
    score: float = Field(..., description="Similarity score 0-1")


class ClassifyItem(BaseModel):
    description: str
    candidates: list[EtimCandidate]


class ClassifyRequest(BaseModel):
    items: list[ClassifyItem]
    tenant_id: Optional[str] = None


class ClassifyResult(BaseModel):
    etim_class_code: str
    etim_class_name: Optional[str] = None
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    reasoning: str = ""
    extracted_features: list[ExtractedFeature] = []


class ClassifyResponse(BaseModel):
    results: list[ClassifyResult]


class MatchClassesRequest(BaseModel):
    descriptions: list[str]


class MatchClassesResult(BaseModel):
    description: str
    candidates: list[EtimCandidate]


class MatchClassesResponse(BaseModel):
    results: list[MatchClassesResult]


class ProductExport(BaseModel):
    original_description: str
    etim_class_code: Optional[str] = None
    etim_class_name: Optional[str] = None
    ean: Optional[str] = None
    price: Optional[float] = None
    manufacturer_code: Optional[str] = None
    brand: Optional[str] = None
    quantity: Optional[int] = None
    extracted_features: list[ExtractedFeature] = []


class ExportRequest(BaseModel):
    products: list[ProductExport]
    company_id: str = Field(..., min_length=1, max_length=3, description="Metel 3-char company code")
    brand_id: str = Field(..., min_length=1, description="Brand name registered with Metel")


class CorrectionRequest(BaseModel):
    tenant_id: str
    original_description: str
    correct_etim_class: str
    verified_features: list[ExtractedFeature] = []


class CorrectionResponse(BaseModel):
    id: int
    status: str = "saved"


class UploadResponse(BaseModel):
    rows: list[dict]
    headers: list[str]
    row_count: int
