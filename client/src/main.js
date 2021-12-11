const {app, ipcMain} = require('electron')
const {createWindow} = require('./window.js')

ipcMain.on(
    'close_window',
    () => app.quit()
)

app.on(
    'window-all-closed',
    () => app.quit()
)
app.on('ready', createWindow)
