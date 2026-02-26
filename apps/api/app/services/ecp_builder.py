import re
from app.schemas.catalog import ProductExport


def strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text or "")


def pad_right(text: str, width: int) -> str:
    text = text or ""
    return text[:width].ljust(width)


def pad_left(text: str, width: int) -> str:
    text = text or ""
    return text[:width].rjust(width)


def build_ecp_line(product: ProductExport, company_id: str) -> str:
    brand = pad_right(company_id.upper(), 3)                          # Col 1-3
    mfr_code = pad_right(product.manufacturer_code or "", 16)         # Col 4-19
    ean = pad_right(product.ean or "", 13)                            # Col 20-32
    desc = pad_right(strip_html(product.original_description), 43)    # Col 33-75
    qty = pad_left(str(product.quantity or 1), 5)                     # Col 76-80

    line = f"{brand}{mfr_code}{ean}{desc}{qty}"
    assert len(line) == 80, f"ECP line must be 80 chars, got {len(line)}"
    return line


def build_ecp_file(
    products: list[ProductExport],
    company_id: str,
) -> str:
    lines = []
    for product in products:
        lines.append(build_ecp_line(product, company_id))
    return "\r\n".join(lines) + "\r\n"
