const { app, BrowserWindow, Menu } = require("electron");
var path = require("path");
var os = require("os");
console.log(os.type()); // "Windows_NT"
console.log(os.release()); // "10.0.14393"
console.log(os.platform()); // "win32"

if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const { ipcMain, ipcRenderer, shell } = require("electron");
// Set up the `ipcMain` handler for communication between renderer and main process.
const initDataListener = () => {
  if (!ipcMain || !app) {
    throw new Error(
      "Electron Store: You need to call `.initRenderer()` from the main process."
    );
  }

  const appData = {
    defaultCwd: app.getPath("userData"),
    appVersion: app.getVersion(),
  };

  ipcMain.on("electron-store-get-data", (event) => {
    event.returnValue = appData;
  });

  return appData;
};

// Use dot-notation to access nested properties

function createWindow() {
  const win = new BrowserWindow({
    width: 389,
    height: 786,
    icon: path.join(__dirname, "assets/icons/png/64x64.png"),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // var skip;
  // win.webContents
  // .executeJavaScript('localStorage.getItem("skip");', true)
  // .then(result => {
  // skip = result;
  // win.loadFile("./surfnwork/firstpage.html");
  // });
  // console.log("result" + skip);
  //if(skip != 1){
  win.loadFile("./surfnwork/firstpage.html");
  require("./menu");
  // }else{
  // win.loadFile("./surfnwork/login.html");
  // }

  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

const { powerMonitor } = require("electron");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("get_idle", (event, args) => {
  var idle = powerMonitor.getSystemIdleTime();
  return idle;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require("child_process");
  const path = require("path");

  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true,
      });
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(["--createShortcut", exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case "--squirrel-uninstall":
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(["--removeShortcut", exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case "--squirrel-obsolete":
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      application.quit();
      return true;
  }
}
