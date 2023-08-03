import { app, BrowserWindow, shell, Tray, ipcMain, Menu, screen } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'
import path from 'node:path'

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  Menu.setApplicationMenu(null)
  win = new BrowserWindow({
    title: '嘟嘟网盘',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 500,
    height: 650,
    resizable: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  })

  if (url) {
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  update(win)

  const template = [
    {
      label: '重新加载',
      accelerator: 'ctrl+r', //快捷键
      click() {
        win?.reload()
      },
    },
    {
      label: '控制台',
      click() {
        const isDevToolsOpened = win?.webContents.isDevToolsOpened()
        if (isDevToolsOpened) {
          win?.webContents.closeDevTools()
        } else {
          win?.webContents.openDevTools()
        }
      },
    },
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  win?.webContents.on('context-menu', () => {
    contextMenu.popup()
  })

  const iconPath = path.resolve(process.cwd(), 'src/assets/cloud.png')
  const appTray = new Tray(iconPath)
  appTray.setToolTip('嘟嘟网盘')

  win?.on('close', event => {
    event.preventDefault()
    // 隐藏窗口而不是退出应用
    win?.hide()
  })

  appTray.on('double-click', () => {
    win?.show()
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.handle('resizeWindow', (e, winWidth?, winHeight?) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  if (win) {
    win.setSize(winWidth, winHeight)
    win.setResizable(true)
    win.setPosition(Math.floor((width - winWidth) / 2), Math.floor((height - winHeight) / 2))
  }
})
