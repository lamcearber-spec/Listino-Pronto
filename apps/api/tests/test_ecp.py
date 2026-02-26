from app.services.ecp_builder import build_ecp_line, build_ecp_file
from app.schemas.catalog import ProductExport


def test_ecp_column_alignment():
    product = ProductExport(
        original_description="Test product description",
        manufacturer_code="PROD-001",
        ean="1234567890123",
        quantity=10,
    )
    line = build_ecp_line(product, "ABC")
    assert len(line) == 80


def test_ecp_truncation():
    long_desc = "A" * 100
    product = ProductExport(
        original_description=long_desc,
        manufacturer_code="X",
        ean="1234567890123",
        quantity=1,
    )
    line = build_ecp_line(product, "TST")
    assert len(line) == 80
    # Description is col 33-75 = 43 chars, should be truncated
    assert "A" * 43 in line


def test_ecp_padding():
    product = ProductExport(
        original_description="Short",
        manufacturer_code="X",
        ean="123",
        quantity=5,
    )
    line = build_ecp_line(product, "AB")
    assert len(line) == 80
    # Company ID padded to 3 chars
    assert line[:3] == "AB "


def test_ecp_file_crlf():
    products = [
        ProductExport(original_description="Product 1", manufacturer_code="P1", quantity=1),
        ProductExport(original_description="Product 2", manufacturer_code="P2", quantity=2),
    ]
    content = build_ecp_file(products, "TST")
    assert "\r\n" in content
    lines = content.strip().split("\r\n")
    assert len(lines) == 2
    for line in lines:
        assert len(line) == 80


def test_ecp_brand_uppercase():
    product = ProductExport(
        original_description="Test",
        manufacturer_code="CODE",
        quantity=1,
    )
    line = build_ecp_line(product, "abc")
    assert line[:3] == "ABC"


def test_ecp_html_stripped():
    product = ProductExport(
        original_description="<b>Bold</b> product",
        manufacturer_code="X",
        quantity=1,
    )
    line = build_ecp_line(product, "TST")
    assert "<b>" not in line
    assert "Bold" in line
