import re
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree
from xml.dom.minidom import parseString

from app.schemas.catalog import ProductExport


def strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text or "")


def format_price(price: float | None) -> str:
    if price is None:
        return "0.00"
    cleaned = str(price).replace(",", "")
    try:
        return f"{float(cleaned):.2f}"
    except ValueError:
        return "0.00"


def truncate(text: str, max_len: int) -> str:
    text = strip_html(text).strip()
    return text[:max_len] if len(text) > max_len else text


def build_bmecat_xml(
    products: list[ProductExport],
    company_id: str,
    brand_id: str,
) -> str:
    root = Element("BMECAT")
    root.set("version", "2005")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("xsi:noNamespaceSchemaLocation", "https://www.etim-international.com/bmecat_etim_40.xsd")

    # HEADER
    header = SubElement(root, "HEADER")
    catalog = SubElement(header, "CATALOG")
    SubElement(catalog, "LANGUAGE").text = "ita"
    SubElement(catalog, "CATALOG_ID").text = f"LP-{company_id}-{datetime.now().strftime('%Y%m%d')}"
    SubElement(catalog, "CATALOG_VERSION").text = "1.0"
    dt = SubElement(catalog, "DATETIME")
    dt.set("type", "generation_date")
    SubElement(dt, "DATE").text = datetime.now().strftime("%Y-%m-%d")
    SubElement(dt, "TIME").text = datetime.now().strftime("%H:%M:%S")

    supplier = SubElement(header, "SUPPLIER")
    SubElement(supplier, "SUPPLIER_NAME").text = brand_id
    SubElement(supplier, "UDX.EDXF.MANUFACTURER_ACRONYM").text = company_id.upper()[:3]

    # T_NEW_CATALOG
    t_new = SubElement(root, "T_NEW_CATALOG")

    for product in products:
        article = SubElement(t_new, "ARTICLE")
        SubElement(article, "SUPPLIER_AID").text = product.manufacturer_code or ""

        details = SubElement(article, "ARTICLE_DETAILS")
        SubElement(details, "DESCRIPTION_SHORT").text = truncate(product.original_description, 80)
        SubElement(details, "DESCRIPTION_LONG").text = strip_html(product.original_description)
        if product.ean:
            SubElement(details, "EAN").text = product.ean
        status = SubElement(details, "PRODUCT_STATUS")
        status.set("type", "others")
        status.text = "20"

        if product.price is not None:
            price_details = SubElement(article, "ARTICLE_PRICE_DETAILS")
            price_elem = SubElement(price_details, "ARTICLE_PRICE")
            price_elem.set("price_type", "net_list")
            SubElement(price_elem, "PRICE_AMOUNT").text = format_price(product.price)
            SubElement(price_elem, "PRICE_CURRENCY").text = "EUR"

        if product.etim_class_code or product.extracted_features:
            chars = SubElement(article, "UDX.EDXF.PRODUCT_CHARACTERISTICS")
            if product.etim_class_code:
                feature_class = SubElement(chars, "UDX.EDXF.FEATURE")
                SubElement(feature_class, "UDX.EDXF.FNAME").text = product.etim_class_code
            for feat in product.extracted_features:
                feature_el = SubElement(chars, "UDX.EDXF.FEATURE")
                SubElement(feature_el, "UDX.EDXF.FNAME").text = feat.feature_code
                SubElement(feature_el, "UDX.EDXF.FVALUE").text = str(feat.value)
                if feat.unit:
                    SubElement(feature_el, "UDX.EDXF.FUNIT").text = feat.unit

    xml_str = tostring(root, encoding="unicode", xml_declaration=False)
    pretty = parseString(xml_str).toprettyxml(indent="  ")
    lines = [line for line in pretty.split("\n") if line.strip()]
    # Replace minidom's default declaration with one that includes encoding
    if lines and lines[0].startswith("<?xml"):
        lines[0] = '<?xml version="1.0" encoding="UTF-8"?>'
    return "\n".join(lines)
