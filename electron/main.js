import { app, BrowserWindow, screen } from 'electron';
import fetch from 'node-fetch';

async function createWindows() {
    const displays = screen.getAllDisplays().sort((a,b) => a.bounds.x - b.bounds.x);

    for (let i = 0; i < displays.length; i++) {
        const display = displays[i];
        const screenId = `${i + 1}`; // matches your API records: 1, 2, 3…
        const apiUrl = `http://localhost:3000/api/getLayoutForScreen?screenId=${screenId}`;

        let layoutId;
        for (let attempt = 1; attempt <= 10; attempt++) {
            try {
                const res = await fetch(apiUrl);
                if (res.ok) {
                    const data = await res.json();
                    layoutId = data.layoutId;
                    break;
                }
            } catch {}
            await new Promise(r => setTimeout(r, 1000));
        }

        if (!layoutId) {
            console.error(`Failed to get layout for ${screenId}, skipping`);
            continue;
        }

        const win = new BrowserWindow({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            fullscreen: true,
            webPreferences: { nodeIntegration: false, contextIsolation: true }
        });

        win.loadURL(`http://localhost:3000/viewer/${layoutId}`);
    }
}

app.whenReady().then(async () => {
    const isDev = !app.isPackaged;

    if (isDev) {
        console.log('Dev mode: skipping internal server start, waiting for dev server');
        // Give dev server time to fully compile
        setTimeout(async () => {
            await createWindows();
        }, 3000);
    } else {
        console.log('Prod mode: starting internal server');
        await startServer(); // only in production
        await createWindows();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
