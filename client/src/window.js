module.exports.createWindow = () => {
    const {BrowserWindow, screen} = require('electron')
	let win = new BrowserWindow(
		{
			title                  : 'Extent',
			width                  : 1280,
			height                 : 720,
			minWidth               : 940,
			minHeight              : 500,
			maxWidth               : screen.getPrimaryDisplay().size.width,
			maxHeight              : screen.getPrimaryDisplay().size.height,
			show                   : false,
			frame                  : false,
			webPreferences         :{
				// devTools           : false, // todo activate this line
				nodeIntegration    : true,
				enableRemoteModule : true,
				contextIsolation   : false, // <-- "require('electron').remote.getCurrentWindow()" didn't work without this line
			},
			backgroundColor        : '#191729',
			// todo--> icon: "path"
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
}