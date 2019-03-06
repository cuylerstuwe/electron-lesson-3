const electron = require('electron');
const { Tray, app, Menu } = electron;

class TimerTray extends Tray {
    constructor(path, mainWindow) {
        super(path);
        this.mainWindow = mainWindow;
        this.setToolTip('Timer App');
        this.on('click', this.onClick.bind(this));
        this.on('right-click', this.onRightClick.bind(this));
    }

    onClick(e, bounds) {
        const { x, y } = bounds;
        const { height, width } = this.mainWindow.getBounds();
        this.mainWindow.setBounds({
            x: x - width / 2,
            y: y,
            height,
            width
        });
        this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show();
    }

    onRightClick(e, bounds) {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ])

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = TimerTray;