from fastapi import APIRouter
from fastapi.responses import Response

from app.schemas.catalog import ExportRequest, ProductExport
from app.services.bmecat_builder import build_bmecat_xml
from app.services.ecp_builder import build_ecp_file

from datetime import datetime

router = APIRouter()


@router.post("/export/bmecat")
async def export_bmecat(request: ExportRequest):
    products = [ProductExport(**p.model_dump()) for p in request.products]
    xml_content = build_bmecat_xml(products, request.company_id, request.brand_id)
    date_str = datetime.now().strftime("%Y%m%d")
    return Response(
        content=xml_content.encode("utf-8"),
        media_type="application/xml",
        headers={
            "Content-Disposition": f'attachment; filename="listino-{date_str}.xml"'
        },
    )


@router.post("/export/ecp")
async def export_ecp(request: ExportRequest):
    products = [ProductExport(**p.model_dump()) for p in request.products]
    ecp_content = build_ecp_file(products, request.company_id)
    date_str = datetime.now().strftime("%Y%m%d")
    return Response(
        content=ecp_content.encode("utf-8"),
        media_type="text/plain",
        headers={
            "Content-Disposition": f'attachment; filename="metel-ecp-{date_str}.txt"'
        },
    )
