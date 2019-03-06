// @ts-check

const MainWindow = require('./app/MainWindow');

const path = require('path');
const electron = require('electron');

const TimerTray = require('./app/TimerTray');

const { app, BrowserWindow } = electron;

/** @type BrowserWindow */
let mainWindow;

/** @type TimerTray */
let tray;

app.on('ready', () => {
    app.dock.hide();
    mainWindow = new MainWindow();

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
    
    const iconName = process.platform.startsWith("win") ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
    tray = new TimerTray(iconPath, mainWindow);
});