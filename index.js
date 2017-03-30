const {app, BrowserWindow} = require('electron');

app.on('ready', function () {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});