import { useEffect, useState } from 'react'
import { FileItem } from '@/types/file'
import api from '@/api'
import FileTable from '@/components/file/FileTable'
import FileEmpty from '@/components/file/FileEmpty'
import ActionButton from '@/components/file/ActionButton'

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
  return (
    <div className="h-full p-5">
      {fileList.length ? (
        <FileTable
          fileList={fileList}
          getFileList={getFileList}
        />
      ) : (
        <FileEmpty getFileList={getFileList} />
      )}
      <ActionButton getFileList={getFileList} />
    </div>
  )
}

export default File
