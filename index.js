const {app, BrowserWindow} = require('electron');

app.on('ready', function () {
    let mainWindow = new BrowserWindow({
        width: 2880,
        height: 1800
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});