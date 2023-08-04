import { FileItem } from '@/types/file'
import { Button, Checkbox, Input, Modal, message } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
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
  const [checked, setChecked] = useState(false)

  const updateDirectory = () => {
    ipcRenderer.send('selectDirectory')
  }

  const confirm = () => {
    if (item.isDir) {
    } else {
      ipcRenderer.send('download', {
        url: item.url,
        directoryPath: downloadPath,
      })
    }
  }

  const setDefaultPath = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked)
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
      footer={
        <div className='flex items-center justify-between mt-6'>
          <div>
            <Checkbox checked={checked} onChange={e => setDefaultPath(e)}>
              设为默认路径
            </Checkbox>
          </div>
          <div className='flex'>
            <Button onClick={close}>取消</Button>
            <Button type='primary' onClick={confirm}>
              确定
            </Button>
          </div>
        </div>
      }
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
