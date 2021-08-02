const {app} = require('electron')
const {createWindow} = require('./window.js')

app.on('ready', createWindow)
app.on('window-all-closed', ()=>app.quit())
