import { spawn } from 'child_process';
import fetch from 'node-fetch';
import { app, BrowserWindow, screen } from 'electron';

async function startServer() {
    return new Promise((resolve, reject) => {
        const server = spawn('npm', ['run', 'start'], { shell: true, stdio: 'inherit' });

        server.on('error', reject);

        const checkServer = async () => {
            try {
                const res = await fetch('http://localhost:3000');
                if (res.ok) return resolve(server); // server ready
            } catch {
                setTimeout(checkServer, 500);
            }
        };
        checkServer();
    });
}

async function createWindows() {
    const displays = screen.getAllDisplays().sort((a, b) => a.bounds.x - b.bounds.x);

    for (let index = 0; index < displays.length; index++) {
        const display = displays[index];
        const screenId = `screen${index + 1}`;
        const apiUrl = `http://localhost:3000/api/getLayoutForScreen?screenId=${screenId}`;

        // Wait until API responds
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
            webPreferences: { nodeIntegration: false, contextIsolation: true },
        });

        win.loadURL(`http://localhost:3000/viewer/${layoutId}`);
    }
}

app.whenReady().then(async () => {
    console.log('Starting Next.js server...');
    await startServer();
    console.log('Server ready, creating windows...');
    await createWindows();
});
