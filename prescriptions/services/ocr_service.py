import os

from pypdf import PdfReader
from PIL import Image
import pytesseract


def extract_text_from_pdf(file):

    reader = PdfReader(file)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text
            text += "\n"

    return text.strip()


def extract_text_from_image(file):

    image = Image.open(file)

    text = pytesseract.image_to_string(
        image
    )

    return text.strip()


def extract_prescription_text(file):

    filename = file.name.lower()

    if filename.endswith(".pdf"):

        return extract_text_from_pdf(file)

    if filename.endswith(
        (".jpg", ".jpeg", ".png")
    ):

        return extract_text_from_image(file)

    raise ValueError(
        "Unsupported prescription file."
    )