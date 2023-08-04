import {
  CloseCircleOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  ExportOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import DownloadModal from './DownloadModal'
import { FileItem } from '@/types/file'
import { useState } from 'react'

interface Props {
  currentItem: FileItem
  show: boolean
  show1: boolean
  cancelCheck: () => void
}

const ActionPopover = (props: Props) => {
  const { currentItem, show, show1, cancelCheck } = props

  const [visible, setVisible] = useState(false)

  const donwload = () => {
    setVisible(true)
  }

  return (
    <>
      <div
        className={`fixed  left-[45%] animate__animated animate__faster
    ${show ? 'animate__fadeInUp  bottom-[50px]' : 'bottom-[50px] animate__fadeOutDown'}
      ${show1 ? '' : 'hidden'}
      `}
      >
        <div className='px-4 py-3 flex w-[340px] items-center justify-evenly rounded-lg bg-[#313136] text-white '>
          <div className='cursor-pointer'>
            <Tooltip title='快传' arrow={false}>
              <CloudDownloadOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer'>
            <Tooltip title='移至资源库' arrow={false}>
              <ExportOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer' onClick={donwload}>
            <Tooltip title='下载' arrow={false}>
              <DownloadOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer'>
            <Tooltip title='收藏' arrow={false}>
              <HeartOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer'>
            <Tooltip title='放入回收站' arrow={false}>
              <DeleteOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer'>
            <Tooltip title='更多' arrow={false}>
              <EllipsisOutlined />
            </Tooltip>
          </div>
          <div className='cursor-pointer' onClick={cancelCheck}>
            <Tooltip title='取消多选' arrow={false}>
              <CloseCircleOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
      <DownloadModal
        item={currentItem}
        visible={visible}
        close={() => setVisible(false)}
      ></DownloadModal>
    </>
  )
}

export default ActionPopover
