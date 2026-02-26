import re
from app.services.bmecat_builder import build_bmecat_xml, strip_html, format_price, truncate
from app.schemas.catalog import ProductExport, ExtractedFeature


def test_strip_html():
    assert strip_html("<b>Bold</b> text") == "Bold text"
    assert strip_html("No HTML") == "No HTML"
    assert strip_html("<p>Paragraph</p><br/>") == "Paragraph"


def test_format_price_dot_separator():
    assert format_price(1250.90) == "1250.90"
    assert format_price(None) == "0.00"
    assert format_price(0.5) == "0.50"


def test_truncate_80_chars():
    long_text = "A" * 100
    result = truncate(long_text, 80)
    assert len(result) == 80


def test_bmecat_utf8():
    products = [
        ProductExport(
            original_description="Interruttore magnetotermico 16A 230V",
            manufacturer_code="MCB-16A",
            ean="1234567890123",
            price=25.50,
            etim_class_code="EC000042",
        )
    ]
    xml = build_bmecat_xml(products, "ABC", "Test Brand")
    assert "encoding=\"UTF-8\"" in xml
    assert "Interruttore" in xml


def test_bmecat_html_stripped():
    products = [
        ProductExport(
            original_description="<b>Bold</b> <em>text</em> product",
            manufacturer_code="TEST-001",
        )
    ]
    xml = build_bmecat_xml(products, "XYZ", "Brand")
    assert "<b>" not in xml
    assert "<em>" not in xml
    assert "Bold" in xml


def test_bmecat_decimal_format():
    products = [
        ProductExport(
            original_description="Test product",
            manufacturer_code="T-01",
            price=1250.90,
        )
    ]
    xml = build_bmecat_xml(products, "ABC", "Brand")
    assert "1250.90" in xml
    assert "1,250" not in xml


def test_bmecat_structure():
    products = [
        ProductExport(
            original_description="Test",
            manufacturer_code="CODE-1",
            etim_class_code="EC000042",
            extracted_features=[
                ExtractedFeature(feature_code="EF000227", feature_name="Rated current", value=16, unit="A"),
            ],
        )
    ]
    xml = build_bmecat_xml(products, "TST", "TestBrand")
    assert "BMECAT" in xml
    assert "T_NEW_CATALOG" in xml
    assert "ARTICLE" in xml
    assert "SUPPLIER_AID" in xml
    assert "EC000042" in xml
    assert "EF000227" in xml


def test_bmecat_company_id():
    products = [ProductExport(original_description="Test", manufacturer_code="X")]
    xml = build_bmecat_xml(products, "abc", "Brand")
    assert "ABC" in xml  # uppercase
