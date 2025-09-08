# Metadata Cleaner

A simple Python-based tool to remove hidden metadata from:
- Images (EXIF data)
- PDFs (document info)
- Word documents (DOCX properties)

## 🚀 How to Run
1. Clone or download this project
2. Install dependencies:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```
4. Open `http://127.0.0.1:5000` in your browser.

## 🖥️ Run as Desktop App (Electron)
A minimal Electron wrapper is included under `desktop/` which launches the Flask server and opens a native window.

1. Ensure the Python environment can run the Flask app (see steps above).
2. Install Node.js dependencies and start Electron:
   ```bash
   cd desktop
   npm install
   npm start
   ```
Electron will spawn the Flask server using your current environment and open the UI.

If you want packaging for macOS/Windows/Linux, I can add `electron-builder` scripts.
