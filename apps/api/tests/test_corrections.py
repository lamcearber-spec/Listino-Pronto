import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_save_correction():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/corrections", json={
            "tenant_id": "test-tenant",
            "original_description": "interruttore 16A",
            "correct_etim_class": "EC000042",
            "verified_features": [],
        })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "saved"


@pytest.mark.asyncio
async def test_get_corrections():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Save one first
        await client.post("/api/v1/corrections", json={
            "tenant_id": "test-tenant-2",
            "original_description": "cavo 2.5mm",
            "correct_etim_class": "EC000056",
            "verified_features": [],
        })
        response = await client.get("/api/v1/corrections/test-tenant-2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
