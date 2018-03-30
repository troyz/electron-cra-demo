const electron = require('electron');
const platform = require('os').platform();  // 获取平台：https://nodejs.org/api/os.html#os_os_platform
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow()
{
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: {
        webSecurity: false, // 这样可以在 webview 中加载/显示本地计算机的图片。
    } });

    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, 'index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
    // Open the DevTools.
    if(startUrl.startsWith('http'))
    {
        mainWindow.webContents.openDevTools();

        // 加载 react/redux 调试工具
        const loadDevtool = require('electron-load-devtool');
        loadDevtool(loadDevtool.REDUX_DEVTOOLS);
        loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
        // if('darwin' === platform)
        // {
        //     BrowserWindow.addDevToolsExtension('/Users/issuser/Library/Application\ Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.1.0_0');
        //     BrowserWindow.addDevToolsExtension('/Users/issuser/Library/Application\ Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.2_0');
        // }
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

app.on('activate', function ()
{
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        createWindow();
    }
});

electron.ipcMain.on('chooseFolder', function(){
    const dialog = electron.dialog;
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.