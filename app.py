import os
from flask import Flask, render_template, request, send_file
from cleaner.image_cleaner import clean_image
from cleaner.pdf_cleaner import clean_pdf
from cleaner.docx_cleaner import clean_docx

UPLOAD_FOLDER = "uploads"
CLEANED_FOLDER = "cleaned"

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["CLEANED_FOLDER"] = CLEANED_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLEANED_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if "file" not in request.files:
            return "No file uploaded!"

        file = request.files["file"]
        if file.filename == "":
            return "No file selected!"

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        ext = file.filename.lower().split(".")[-1]
        cleaned_path = os.path.join(app.config["CLEANED_FOLDER"], "cleaned_" + file.filename)

        if ext in ["jpg", "jpeg", "png"]:
            clean_image(filepath, cleaned_path)
        elif ext == "pdf":
            clean_pdf(filepath, cleaned_path)
        elif ext == "docx":
            clean_docx(filepath, cleaned_path)
        else:
            return "File type not supported!"

        return send_file(cleaned_path, as_attachment=True)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
