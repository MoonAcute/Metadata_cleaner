const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let flaskProcess = null;
let mainWindow = null;
const SERVER_URL = 'http://127.0.0.1:5000';

function waitForServer(url, timeoutMs = 20000, intervalMs = 500) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, () => resolve()).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Server did not start in time'));
        } else {
          setTimeout(check, intervalMs);
        }
      });
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 900,
    minHeight: 600,
    title: 'Metadata Cleaner',
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(SERVER_URL);
}

function startFlask() {
  const python = process.env.VIRTUAL_ENV
    ? path.join(process.env.VIRTUAL_ENV, 'bin', 'python')
    : process.platform === 'win32' ? 'python' : 'python3';

  const scriptPath = path.join(__dirname, '..', 'app.py');
  flaskProcess = spawn(python, [scriptPath], { cwd: path.join(__dirname, '..') });

  flaskProcess.stdout.on('data', (data) => {
    console.log(`[flask] ${data}`);
  });
  flaskProcess.stderr.on('data', (data) => {
    console.error(`[flask] ${data}`);
  });
  flaskProcess.on('close', (code) => {
    console.log(`Flask exited with code ${code}`);
  });
}

app.on('ready', async () => {
  try {
    startFlask();
    await waitForServer(SERVER_URL);
    createWindow();
  } catch (err) {
    dialog.showErrorBox('Startup Error', String(err));
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

app.on('before-quit', () => {
  try {
    if (flaskProcess) flaskProcess.kill();
  } catch (e) {
    /* noop */
  }
});


