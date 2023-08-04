import { BrowserWindow, dialog, ipcMain } from 'electron'

export function selectDirectory(win: BrowserWindow) {
  ipcMain.on('selectDirectory', event => {
    dialog
      .showOpenDialog(win, {
        properties: ['openDirectory'],
      })
      .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
          event.reply('selectedDirectory', result.filePaths[0])
        }
      })
  })
}
