from pypdf import PdfReader, PdfWriter

def clean_pdf(input_file, output_file):
    """Removes metadata from a PDF."""
    reader = PdfReader(input_file)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.add_metadata({})

    with open(output_file, "wb") as f:
        writer.write(f)

    return output_file
