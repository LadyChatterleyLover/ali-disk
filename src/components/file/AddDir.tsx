import api from '@/api'
import { Button, Input, Modal, message } from 'antd'
import { useState } from 'react'

interface Props {
  visible: boolean
  setVisible: (val: boolean) => void
  getFileList: () => void
}

const AddDir = (props: Props) => {
  const { visible, setVisible, getFileList } = props

  const [value, setValue] = useState('新建文件夹')

  const confirm = () => {
    api.file
      .createDir({
        name: value,
      })
      .then(res => {
        if (res.code === 200) {
          message.success(res.msg)
          getFileList()
          setVisible(false)
        } else {
          message.error(res.msg)
        }
      })
  }

  const cancel = () => {
    setValue('新建文件夹')
    setVisible(false)
  }

  return (
    <Modal
      title='新建文件夹'
      width={340}
      open={visible}
      onCancel={cancel}
      footer={
        <Button size='small' type='primary' disabled={value === ''} onClick={confirm}>
          确认
        </Button>
      }
    >
      <div className='flex flex-col items-center'>
        <img
          alt='folder'
          height={90}
          src='https://img.alicdn.com/imgextra/i1/O1CN01rGJZac1Zn37NL70IT_!!6000000003238-2-tps-230-180.png'
        />
        <Input
          className='mt-12 mb-5 bg-[#ebebed]'
          allowClear
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default AddDir
