import { useEffect, useState } from 'react'
import { FileItem } from '@/types/file'
import api from '@/api'
import FileList from '@/components/file/FileList'

const File = () => {
  const [fileList, setFileList] = useState<FileItem[]>([])

  const getFileList = () => {
    api.file.getFileList().then(res => {
      if (res.code === 200) {
        res.data.map(item => {
          item.checked = false
        })
        setFileList(res.data)
      }
    })
  }

  useEffect(() => {
    getFileList()
  }, [])
  return <div>{fileList.length ? <FileList fileList={fileList} /> : null}</div>
}

export default File
