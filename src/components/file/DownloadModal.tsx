import { FileItem } from '@/types/file'
import { Button, Input, Modal, message } from 'antd'
import { ipcRenderer } from 'electron'
import { download } from 'electron-dl'
import { useEffect, useState } from 'react'
interface Props {
  item: FileItem
  visible: boolean
  close: () => void
}

const DownloadModal = (props: Props) => {
  const { item, visible, close } = props
  const [downloadPath, setDownloadPath] = useState('')

  const updateDirectory = () => {
    ipcRenderer.send('selectDirectory')
  }

  const confirm = () => {
    ipcRenderer.send('download', {
      url: item.url,
      directoryPath: downloadPath,
    })
  }

  useEffect(() => {
    ipcRenderer.send('getAppPath')
  }, [])

  useEffect(() => {
    ipcRenderer.on('appPathResponse', (_, path) => {
      setDownloadPath(path)
    })
    ipcRenderer.on('selectedDirectory', (_, path) => {
      setDownloadPath(path)
    })
    ipcRenderer.on('downloadSuccess', (_, path) => {
      message.success('下载成功')
      close()
    })
    return () => {
      ipcRenderer.removeAllListeners('appPathResponse')
    }
  }, [])

  return visible ? (
    <Modal
      title={`下载 ${item?.name} 到`}
      open={visible}
      maskClosable={false}
      closable={false}
      okButtonProps={{ type: 'primary' }}
      onCancel={close}
      onOk={confirm}
    >
      <div className='flex'>
        <Input value={downloadPath} readOnly></Input>
        <Button type='link' className='text-[#637dff]' onClick={updateDirectory}>
          更改
        </Button>
      </div>
    </Modal>
  ) : null
}

export default DownloadModal
