const { Menu } = require("electron");
const electron = require("electron");
const app = electron.app;

const template = [
  {
    role: "help",
    label: i18n.__("Help"),
    submenu: [
      {
        label: i18n.__("Learn more"),
        click() {
          require("electron").shell.openExternal(
            "https://github.com/crilleengvall/electron-tutorial-app"
          );
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        type: "separator",
      },
      {
        role: "services",
        label: "Services",
      },
      {
        type: "separator",
      },
      {
        role: "hide",
        label: "Hide",
      },

      {
        type: "separator",
      },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
