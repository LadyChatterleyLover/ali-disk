import axios from 'axios'
import { ipcMain } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs'

export function donwloadDir() {
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
}
