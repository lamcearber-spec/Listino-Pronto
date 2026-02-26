from app.services.file_parser import parse_csv_content, auto_detect_mapping, normalize_rows


def test_parse_csv_content():
    csv_bytes = b"Description,EAN,Price\nWidget A,1234567890123,10.50\nWidget B,9876543210987,25.00"
    rows, headers = parse_csv_content(csv_bytes)
    assert len(rows) == 2
    assert headers == ["Description", "EAN", "Price"]
    assert rows[0]["Description"] == "Widget A"
    assert rows[1]["Price"] == "25.00"


def test_auto_detect_mapping():
    headers = ["Descrizione", "codice_ean", "Prezzo", "SKU", "Marca"]
    mapping = auto_detect_mapping(headers)
    assert mapping["description"] == "Descrizione"
    assert mapping["ean"] == "codice_ean"
    assert mapping["price"] == "Prezzo"
    assert mapping["manufacturer_code"] == "SKU"
    assert mapping["brand"] == "Marca"


def test_auto_detect_mapping_case_insensitive():
    headers = ["DESCRIPTION", "ean", "PRICE"]
    mapping = auto_detect_mapping(headers)
    assert mapping["description"] == "DESCRIPTION"
    assert mapping["ean"] == "ean"
    assert mapping["price"] == "PRICE"


def test_normalize_rows():
    rows = [
        {"Descrizione": "Item A", "codice_ean": "123", "Prezzo": "10"},
        {"Descrizione": "Item B", "codice_ean": "456", "Prezzo": "20"},
    ]
    mapping = {"description": "Descrizione", "ean": "codice_ean", "price": "Prezzo"}
    normalized = normalize_rows(rows, mapping)
    assert len(normalized) == 2
    assert normalized[0]["description"] == "Item A"
    assert normalized[0]["ean"] == "123"
    assert normalized[1]["price"] == "20"


def test_parse_csv_utf8_bom():
    csv_bytes = b"\xef\xbb\xbfDescription,Price\nTest,5.00"
    rows, headers = parse_csv_content(csv_bytes)
    assert headers == ["Description", "Price"]
    assert rows[0]["Description"] == "Test"
