import { FileAddOutlined, FolderAddOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Popover } from 'antd'

const ActionButton = () => {
  const content = () => {
    return (
      <div className='pr-10'>
        <div className='text-xs text-[#25262bb7] mt-3 mb-5'>添加到备份盘</div>
        <div className='flex items-center text-[#25262b] mb-3 cursor-pointer'>
          <FileAddOutlined />
          <div className='ml-3'>上传文件</div>
        </div>
        <div className='flex items-center text-[#25262b] mb-3 cursor-pointer'>
          <UploadOutlined />
          <div className='ml-3'>上传文件夹</div>
        </div>
        <div className='flex items-center text-[#25262b] mb-3 cursor-pointer'>
          <FolderAddOutlined />
          <div className='ml-3'>新建文件夹</div>
        </div>
      </div>
    )
  }

  return (
    <Popover content={content} trigger='click' placement='topRight' arrow={false}>
      <div className='bg-[#637dff] w-[56px] h-[56px] rounded-full flex justify-center items-center fixed bottom-12 right-12 cursor-pointer'>
        <PlusOutlined className='text-white text-2xl' />
      </div>
    </Popover>
  )
}

export default ActionButton
