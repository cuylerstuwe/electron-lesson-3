const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const bluebird = require('bluebird');
const path = require('path');

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

ipcMain.on('conversion:start', (e, videos) => {

    for (const video of videos) {

        const outputName = video.name.replace(/\.[^.]+$/, "");
        const outputDir = path.dirname(video.path);

        console.log(outputName, outputDir);

        const fullOutputPath = path.join(outputDir, outputName + "." + video.format);

        ffmpeg(video.path)
            .output(fullOutputPath)
            .on('progress', ({ timemark }) => { mainWindow.webContents.send('conversion:progress', { video, timemark } ) })
            .on('end', () => mainWindow.webContents.send('conversion:end', { video: video, outputPath: fullOutputPath }))
            .run();
    }

});