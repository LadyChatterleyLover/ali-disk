import api from '@/api'
import { Modal, Upload, UploadProps, message } from 'antd'
import { useState } from 'react'
import AddDir from './AddDir'

const { Dragger } = Upload

interface Props {
  getFileList: () => void
  dirId?: number
}

const FileEmpty = (props: Props) => {
  const { getFileList, dirId } = props

  const [addDirVisible, setAddDirVisible] = useState(false)

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

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <Dragger
        {...uploadProps}
        showUploadList={false}
        style={{ background: '#fff', border: 'none' }}
      >
        <div className='mb-5'>将文件拖拽到这里</div>
      </Dragger>
      <div className='text-xs text-[#25262b5b] mb-7'>或者</div>
      <div className='flex'>
        <div
          className='relative overflow-hidden w-[106px] h-[120px] rounded-lg cursor-pointer text-sm pt-5 text-center text-[#25262bb7] bg-[#84858d14] mr-6'
          onClick={() => setAddDirVisible(true)}
        >
          <span>新建文件夹</span>
          <img
            className='absolute top-[69px] left-[34px] w-[72px] h-[72px]'
            src='https://img.alicdn.com/imgextra/i2/O1CN018yXBXY1caApf7qUew_!!6000000003616-2-tps-224-224.png'
            alt='新建文件夹'
          ></img>
        </div>
        <Upload {...uploadProps} showUploadList={false}>
          <div className='relative overflow-hidden w-[106px] h-[120px] rounded-lg cursor-pointer text-sm pt-5 text-center text-[#25262bb7] bg-[#84858d14] mr-6'>
            <span>上传文件</span>
            <img
              className='absolute top-[69px] left-[34px] w-[72px] h-[72px]'
              src='https://img.alicdn.com/imgextra/i4/O1CN01Ojh9qS1rrJtSy0dN4_!!6000000005684-2-tps-224-224.png'
              alt='上传文件'
            ></img>
          </div>
        </Upload>
        <Upload {...uploadProps} showUploadList={false} directory>
          <div className='relative overflow-hidden w-[106px] h-[120px]  rounded-lg cursor-pointer text-sm pt-5 text-center text-[#25262bb7] bg-[#84858d14] mr-6'>
            <span>上传文件夹</span>
            <img
              className='absolute top-[69px] left-[34px] w-[72px] h-[72px]'
              src='https://img.alicdn.com/imgextra/i3/O1CN01ZN75Oi21TBCK21ubJ_!!6000000006985-2-tps-224-224.png'
              alt='上传文件夹'
            ></img>
          </div>
        </Upload>
      </div>

      <AddDir
        visible={addDirVisible}
        setVisible={setAddDirVisible}
        getFileList={getFileList}
      ></AddDir>
    </div>
  )
}

export default FileEmpty
