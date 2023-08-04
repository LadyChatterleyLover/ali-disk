import { BrowserWindow, ipcMain, screen } from 'electron'

export function resizeWindow(win: BrowserWindow) {
  ipcMain.handle('resizeWindow', (_, winWidth?, winHeight?) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    if (win) {
      win.setSize(winWidth, winHeight)
      win.setResizable(true)
      win.setPosition(Math.floor((width - winWidth) / 2), Math.floor((height - winHeight) / 2))
    }
  })
}
