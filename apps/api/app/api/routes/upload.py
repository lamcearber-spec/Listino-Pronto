from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.file_parser import parse_csv_content, auto_detect_mapping
from app.schemas.catalog import UploadResponse

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("csv", "xlsx", "xls"):
        raise HTTPException(status_code=400, detail="Unsupported file format. Use CSV or Excel.")

    content = await file.read()

    if ext == "csv":
        rows, headers = parse_csv_content(content)
    else:
        try:
            import openpyxl
            import io
            wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True)
            ws = wb.active
            all_rows = list(ws.iter_rows(values_only=True))
            if not all_rows:
                raise HTTPException(status_code=400, detail="Empty spreadsheet")
            headers = [str(h or "") for h in all_rows[0]]
            rows = []
            for row in all_rows[1:]:
                rows.append({headers[i]: str(cell or "") for i, cell in enumerate(row)})
        except ImportError:
            raise HTTPException(status_code=500, detail="Excel parsing requires openpyxl")

    mapping = auto_detect_mapping(headers)

    return UploadResponse(
        rows=rows,
        headers=headers,
        row_count=len(rows),
    )
