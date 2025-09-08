(() => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const cleanBtn = document.getElementById('clean-btn');
  const resetBtn = document.getElementById('reset-btn');
  const progressBar = document.getElementById('progress-bar');
  const preview = document.getElementById('preview');
  const thumb = document.getElementById('thumb');
  const fileNameEl = document.getElementById('file-name');
  const fileSizeEl = document.getElementById('file-size');

  let selectedFile = null;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function setProgress(percent) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    progressBar.style.width = `${value}%`;
    progressBar.textContent = `${value}%`;
    progressBar.setAttribute('aria-valuenow', String(value));
  }

  function resetUI() {
    selectedFile = null;
    setProgress(0);
    cleanBtn.disabled = true;
    preview.classList.add('d-none');
    thumb.style.backgroundImage = '';
    fileNameEl.textContent = '';
    fileSizeEl.textContent = '';
  }

  function showPreview(file) {
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    const ext = file.name.split('.').pop().toLowerCase();
    if (['png','jpg','jpeg'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = () => {
        thumb.style.backgroundImage = `url(${reader.result})`;
      };
      reader.readAsDataURL(file);
    } else {
      // Fallback icons for non-image types
      const icon = ext === 'pdf' ? '🧾' : '📄';
      const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='54%' text-anchor='middle' font-size='28'>${icon}</text></svg>`);
      thumb.style.backgroundImage = `url("data:image/svg+xml,${svg}")`;
    }
    preview.classList.remove('d-none');
  }

  function pickFile() {
    fileInput.click();
  }

  function handleFiles(files) {
    if (!files || !files.length) return;
    const file = files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg','jpeg','png','pdf','docx'];
    if (!allowed.includes(ext)) {
      alert('Unsupported file type. Allowed: JPG, PNG, PDF, DOCX');
      return;
    }
    selectedFile = file;
    showPreview(file);
    cleanBtn.disabled = false;
  }

  function uploadAndDownload() {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    setProgress(1);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.responseType = 'blob';

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Try to extract filename from Content-Disposition
        let filename = `cleaned_${selectedFile.name}`;
        const disp = xhr.getResponseHeader('Content-Disposition');
        if (disp) {
          const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disp);
          const extracted = match && (match[1] || match[2]);
          if (extracted) filename = decodeURIComponent(extracted);
        }
        const url = window.URL.createObjectURL(xhr.response);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setProgress(100);
      } else {
        alert('Failed to clean file.');
        setProgress(0);
      }
    };

    xhr.onerror = () => {
      alert('Network error.');
      setProgress(0);
    };

    xhr.send(formData);
  }

  // Events
  dropZone.addEventListener('click', pickFile);
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
  cleanBtn.addEventListener('click', uploadAndDownload);
  resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    resetUI();
  });

  // Init
  resetUI();
})();


