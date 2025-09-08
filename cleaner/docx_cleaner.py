from docx import Document

def clean_docx(input_file, output_file):
    """Removes metadata from a Word document."""
    doc = Document(input_file)
    core_props = doc.core_properties

    core_props.author = None
    core_props.title = None
    core_props.subject = None
    core_props.keywords = None
    core_props.last_modified_by = None

    doc.save(output_file)
    return output_file
