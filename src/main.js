"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5857 });
// Type "Hello World" then press enter.
var robot = require("robotjs");
robot.setKeyboardDelay(1);
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('src/settings/settings.html');
    // setInterval(function(){
    //   // Type "Hello World".
    //   robot.typeString("Hello world!");
    // }, 3000);
    wss.on('connection', function (w) {
        w.on('message', function (data) {
            console.log(data);
            // robot.typeStringDelayed(data,0);
            for (const s of data) {
                robot.unicodeTap(s.charCodeAt(0));
            }
        });
        w.on('close', function () {
            console.log("Closed");
        });
        w.send("Hello interface!");
    });
}
const createToolbar = () => {
    const win = new electron_1.BrowserWindow({
        show: false,
        transparent: true,
        frame: false,
        // An electron bug makes the bgcolor white on navigation/reload for #000000 and #00000000
        backgroundColor: '#00ffffff',
        // skipTaskbar: true,
        hasShadow: false,
        width: 150,
        height: 150,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('src/toolbar/toolbar.html');
    console.log('initialized');
    win.on('ready-to-show', () => {
        win.show();
        console.log('showing');
    });
};
electron_1.app.whenReady().then(createWindow).then(createToolbar);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
