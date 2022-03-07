// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require("electron-winstaller");

// In this case, we can use relative paths
var settings = {
  // Specify the folder where the built app is located
  appDirectory: "./myapp-source-built-win32-x64",
  // Specify the existing folder where
  // Specify the existing folder where
  outputDirectory: "./installer",
  // The name of the Author of the app (the name of your company)
  description: "SnW Time Tracker App",
  authors: "SnW Time Tracker App",
  // The name of the executable of your built
  exe: "./myapp-source-built.exe",
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(
  () => {
    console.log(
      "The installers of your application were succesfully created !"
    );
  },
  (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`);
  }
);
