module.exports.createWindow = () => {
    const {BrowserWindow, screen, ipcMain} = require('electron')

    let win = new BrowserWindow(
        {
            title                  : 'depesha',
            width                  : 1280,
            height                 : 720,
            minWidth               : 940,
            minHeight              : 500,
            maxWidth               : screen.getPrimaryDisplay().size.width,
            maxHeight              : screen.getPrimaryDisplay().size.height,
            show                   : false,
            frame                  : false,
            webPreferences         : {
                // devTools        : false, // todo activate this line before compiliere
                nodeIntegration    : true,
                contextIsolation   : false // <-- "require('electron')" in web.js didn't work without this line
            },
            backgroundColor        : '#191729',
            icon: "./src/main_window/materials/ico/depesha.ico"
        }
    )
    
    win.loadFile('./src/main_window/html/index.html')
    win.once(
        'ready-to-show',
        () => win.show()
    )
    win.maximize()
    win.on(
        'closed',
        () => win = null
    )

    ipcMain.on(
        'max_window',
        () => win.isMaximized()? win.unmaximize() : win.maximize()
    )
    ipcMain.on(
        'minimize_window',
        () => win.minimize()
    )
}
