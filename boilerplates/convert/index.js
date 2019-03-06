const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const bluebird = require('bluebird');

const probePromise = bluebird.promisify(ffmpeg.ffprobe);

const { app, BrowserWindow, ipcMain } = electron;

/** @type BrowserWindow */
let mainWindow;

app.on('ready', () => {
    /** @type BrowserWindow */
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            backgroundThrottling: false
        }
    });

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on('videos:added', async (e, videos) => {
    const promises = Promise.all(videos.map(video => probePromise(video.path)));
    const allVideosMetadata = await promises;
    const results = allVideosMetadata.map((videoMetadata, i) => Object.assign({}, videos[i], {duration: videoMetadata.format.duration, format: 'avi' }));
    mainWindow.webContents.send('metadata:complete', results);
});