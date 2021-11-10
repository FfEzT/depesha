const {app} = require('electron')
const {createWindow} = require('./window.js')

app.on(
    'window-all-closed',
    () => app.quit()
)
app.on('ready', createWindow)
