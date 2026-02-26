import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_upload_csv():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        csv_content = b"Description,EAN,Price\nWidget A,1234567890123,10.50"
        response = await client.post(
            "/api/v1/upload",
            files={"file": ("test.csv", csv_content, "text/csv")},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["row_count"] == 1
    assert "Description" in data["headers"]


@pytest.mark.asyncio
async def test_upload_invalid_format():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/upload",
            files={"file": ("test.pdf", b"fake pdf", "application/pdf")},
        )
    assert response.status_code == 400
