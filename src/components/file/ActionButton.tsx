import { FileAddOutlined, FolderAddOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Popover, Upload, UploadProps, message } from 'antd'
import AddDir from './AddDir'
import { useState } from 'react'
import api from '@/api'

interface Props {
  getFileList: () => void
  dirId?: number
}

const ActionButton = (props: Props) => {
  const { dirId, getFileList } = props
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  const uploadProps: UploadProps = {
    name: 'file',
    action: '',
    beforeUpload() {
      return false
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        const formData = new FormData()
        formData.append('file', info.file as any)
        formData.append('dirId', dirId ? String(dirId) : '')
        api.file.uploadFile(formData).then(res => {
          if (res.code === 200) {
            message.success(res.msg)
            getFileList()
          } else {
            message.error(res.msg)
          }
        })
      }
    },
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const content = () => {
    return (
      <div className='pr-10'>
        <div className='text-xs text-[#25262bb7] mt-3 mb-5'>添加到备份盘</div>
        <div onClick={() => setOpen(false)}>
          <Upload {...uploadProps} showUploadList={false}>
            <div className='flex items-center text-[#25262b] mb-3 cursor-pointer'>
              <FileAddOutlined />
              <div className='ml-3'>上传文件</div>
            </div>
          </Upload>
        </div>
        <div onClick={() => setOpen(false)}>
          <Upload {...uploadProps} showUploadList={false} directory>
            <div className='flex items-center text-[#25262b] mb-3 cursor-pointer'>
              <UploadOutlined />
              <div className='ml-3'>上传文件夹</div>
            </div>
          </Upload>
        </div>
        <div
          className='flex items-center text-[#25262b] mb-3 cursor-pointer'
          onClick={() => {
            setVisible(true)
            setOpen(false)
          }}
        >
          <FolderAddOutlined />
          <div className='ml-3'>新建文件夹</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        trigger='click'
        placement='topRight'
        arrow={false}
      >
        <div className='bg-[#637dff] w-[56px] h-[56px] rounded-full flex justify-center items-center fixed bottom-12 right-12 cursor-pointer'>
          <PlusOutlined className='text-white text-2xl' />
        </div>
      </Popover>
      <AddDir visible={visible} setVisible={setVisible} getFileList={getFileList}></AddDir>
    </>
  )
}

export default ActionButton
