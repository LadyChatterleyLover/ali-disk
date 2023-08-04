import { message } from 'antd'
import { BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'

export function downloadFile() {
  ipcMain.on('download', (_, url) => {
    console.log(111)
    // 调用 electron-dl 的 download 方法实现下载
    download(BrowserWindow.getFocusedWindow()!, url)
      .then(dl => {
        console.log('Download complete:', dl.getSavePath())
        message.success('下载成功')
      })
      .catch(err => {
        // 下载出错时的回调，你可以在这里处理错误
        console.error('Download error:', err)
      })
  })
}
