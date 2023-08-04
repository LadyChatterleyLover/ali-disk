import { FileItem } from '@/types/file'
import { Button, Input, Modal } from 'antd'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
interface Props {
  item: FileItem
  visible: boolean
  close: () => void
}

const DownloadModal = (props: Props) => {
  const { item, visible, close } = props
  const [downloadPath, setDownloadPath] = useState('')

  useEffect(() => {
    ipcRenderer.send('getAppPath')
  }, [])

  useEffect(() => {
    ipcRenderer.on('appPathResponse', (_, path) => {
      setDownloadPath(path)
    })
    return () => {
      ipcRenderer.removeAllListeners('appPathResponse')
    }
  }, [])

  return visible ? (
    <Modal
      title={`下载 ${item?.name} 到`}
      open={visible}
      closable={false}
      okButtonProps={{ type: 'primary' }}
      onCancel={close}
    >
      <div className='flex'>
        <Input defaultValue={downloadPath} readOnly></Input>
        <Button type='link' className='text-[#637dff]'>
          更改
        </Button>
      </div>
    </Modal>
  ) : null
}

export default DownloadModal
