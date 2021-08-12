const path = require('path');
const {
	download
} = require("electron-dl");

const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron');

const isDev = require('electron-is-dev');
var win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			preload: __dirname + '/preload.js'
		},
		show: false,
		frame: false,
		titleBarStyle: 'hidden',
	});
	win.maximize();
	win.show();

	// and load the index.html of the app.
	// win.loadFile("index.html");
	win.loadURL(
		isDev ?
		'http://localhost:3000' :
		`file://${path.join(__dirname, '../build/index.html')}`
	);
	// Open the DevTools.
	if (isDev) {
		win.webContents.openDevTools({
			mode: 'detach'
		});
	}
	ipcMain.on("download", (event, info) => {
		download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
			.then(dl => window.webContents.send("download complete", dl.getSavePath()));
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});