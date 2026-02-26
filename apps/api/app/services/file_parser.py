import csv
import io
from typing import Any

DESCRIPTION_ALIASES = [
    "prod_desc", "description", "descrizione", "beschreibung", "desc",
    "product_description", "nome", "name", "product_name",
]
EAN_ALIASES = ["ean", "ean_code", "barcode", "ean13", "codice_ean", "gtin"]
PRICE_ALIASES = ["price", "prezzo", "price_net", "prezzo_netto", "unit_price", "list_price"]
MANUFACTURER_CODE_ALIASES = [
    "manufacturer_code", "codice_produttore", "sku", "article_number",
    "codice_articolo", "product_code", "cod_art",
]
BRAND_ALIASES = ["brand", "marca", "brand_name", "manufacturer", "produttore"]
QUANTITY_ALIASES = ["quantity", "carton_qty", "quantita", "packing_unit", "qty", "confezione"]

ALL_ALIASES = {
    "description": DESCRIPTION_ALIASES,
    "ean": EAN_ALIASES,
    "price": PRICE_ALIASES,
    "manufacturer_code": MANUFACTURER_CODE_ALIASES,
    "brand": BRAND_ALIASES,
    "quantity": QUANTITY_ALIASES,
}


def auto_detect_mapping(headers: list[str]) -> dict[str, str]:
    mapping: dict[str, str] = {}
    lower_headers = {h.lower().strip(): h for h in headers}
    for field, aliases in ALL_ALIASES.items():
        for alias in aliases:
            if alias.lower() in lower_headers:
                mapping[field] = lower_headers[alias.lower()]
                break
    return mapping


def parse_csv_content(content: bytes) -> tuple[list[dict[str, Any]], list[str]]:
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    headers = reader.fieldnames or []
    rows = list(reader)
    return rows, list(headers)


def normalize_rows(rows: list[dict[str, Any]], mapping: dict[str, str]) -> list[dict[str, Any]]:
    normalized = []
    for row in rows:
        item: dict[str, Any] = {}
        for standard_field, source_col in mapping.items():
            if source_col in row:
                item[standard_field] = row[source_col]
        normalized.append(item)
    return normalized
