import { app, BrowserWindow, shell, Tray, ipcMain, Menu } from 'electron'
import path from 'node:path'
import * as fs from 'node:fs'
import axios from 'axios'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'
import { downloadFile } from './download'
import { selectDirectory } from './selectDirectory'
import { resizeWindow } from './resizeWindow'

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
    win?.hide()
  })

  appTray.on('double-click', () => {
    win?.show()
  })
  resizeWindow(win!)
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

downloadFile()
selectDirectory(win!)

ipcMain.on('getAppPath', event => {
  event.reply('appPathResponse', app.getPath('downloads'))
})

ipcMain.on('donwloadDir', async (event, { path: folderPath, fileList }) => {
  fs.mkdirSync(folderPath, { recursive: true })
  for (const file of fileList) {
    try {
      const response = await axios.get(file.url, { responseType: 'arraybuffer' })
      const filePath = path.join(folderPath, file.name)
      fs.writeFileSync(filePath, Buffer.from(response.data))
      event.reply('donwloadDirSuccess')
    } catch (error) {
      console.error(`文件 ${file.name} 下载失败：`, error)
    }
  }
})
