import { message } from 'antd'
import { BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'

export function downloadFile() {
  ipcMain.on('download', (event, { url, directoryPath }) => {
    download(BrowserWindow.getFocusedWindow()!, url, {
      directory: directoryPath,
    })
      .then(dl => {
        const savePath = dl.getSavePath()
        event.reply('downloadSuccess', savePath)
      })
      .catch(err => {
        console.error('Download error:', err)
      })
  })
}
