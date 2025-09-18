import { app, BrowserWindow, screen } from 'electron';
import fetch from 'node-fetch';

async function createWindows() {
    const displays = screen.getAllDisplays();

    for (const [index, display] of displays.entries()) {
        const screenId = `screen${index + 1}`;

        const response = await fetch(`http://localhost:3000/api/getLayoutForScreen?screenId=${screenId}`);
        const { layoutId } = await response.json();

        const win = new BrowserWindow({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            webPreferences: { nodeIntegration: false, contextIsolation: true },
        });

        win.loadURL(`http://localhost:3000/viewer/${layoutId}`);
    }
}

app.whenReady().then(createWindows);