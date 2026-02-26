import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_export_bmecat():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/export/bmecat", json={
            "products": [
                {
                    "original_description": "Interruttore 16A",
                    "manufacturer_code": "MCB-16",
                    "ean": "1234567890123",
                    "price": 25.50,
                    "etim_class_code": "EC000042",
                    "extracted_features": [],
                }
            ],
            "company_id": "TST",
            "brand_id": "TestBrand",
        })
    assert response.status_code == 200
    assert "xml" in response.headers["content-type"]
    assert "BMECAT" in response.text


@pytest.mark.asyncio
async def test_export_ecp():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/export/ecp", json={
            "products": [
                {
                    "original_description": "Interruttore 16A",
                    "manufacturer_code": "MCB-16",
                    "ean": "1234567890123",
                    "quantity": 10,
                    "extracted_features": [],
                }
            ],
            "company_id": "TST",
            "brand_id": "TestBrand",
        })
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    lines = response.text.strip().split("\r\n")
    for line in lines:
        assert len(line) == 80
