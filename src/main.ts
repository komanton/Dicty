import { app, BrowserWindow } from 'electron';
const WebSocket = require("ws")
const wss = new WebSocket.Server( { port: 5857 } )
// Type "Hello World" then press enter.
var robot = require("robotjs");
robot.setKeyboardDelay(1);

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/settings/settings.html')
  // setInterval(function(){
  //   // Type "Hello World".
  //   robot.typeString("Hello world!");
  // }, 3000);

  wss.on('connection', function (w: any) {
    w.on( 'message' , function (data: any)  {
         console.log(data)
         // robot.typeStringDelayed(data,0);
         for(const s of data) { 
          robot.unicodeTap(s.charCodeAt(0))
        }
    })  
    w.on('close', function() { 
         console.log("Closed") 
    })    
    w.send("Hello interface!")
})   
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
