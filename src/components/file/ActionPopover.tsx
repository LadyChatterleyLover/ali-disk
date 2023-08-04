import {
  CloseCircleOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { Modal, Tooltip, message } from 'antd'
import DownloadModal from './DownloadModal'
import { FileItem } from '@/types/file'
import { useEffect, useState } from 'react'
import api from '@/api'
import { cloneDeep } from 'lodash-es'
import CcIcon from '../icon/CcIcon'
import { Heart16Regular, Heart16Filled } from '@ricons/fluent'

interface Props {
  currentItem: FileItem
  show: boolean
  show1: boolean
  cancelCheck: () => void
  getFileList: (params?: any) => void
}

const ActionPopover = (props: Props) => {
  const { currentItem, show, show1, cancelCheck, getFileList } = props

  const [cloneCurrentItem, setCloneCurrentIten] = useState<FileItem>(currentItem)
  const [visible, setVisible] = useState(false)
  const [modal, contextHolder] = Modal.useModal()

  const donwload = () => {
    setVisible(true)
  }

  const delFile = () => {
    modal.confirm({
      title: '删除文件',
      content: '删除的文件可在回收站查看',
      okText: '确定删除',
      okButtonProps: {
        danger: true,
      },
      cancelText: '取消',
      onOk() {
        api.file.recoveryFile([cloneCurrentItem!.id as number]).then(res => {
          if (res.code === 200) {
            message.success(res.msg)
            getFileList?.({
              dirId: cloneCurrentItem?.id,
            })
          } else {
            message.error(res.msg)
          }
        })
      },
    })
  }

  const collection = () => {
    cloneCurrentItem.isCollection = cloneCurrentItem?.isCollection === 0 ? 1 : 0
    setCloneCurrentIten({ ...cloneCurrentItem })
    api.file
      .updateFile({
        isCollection: cloneCurrentItem!.isCollection,
      })
      .then(res => {
        if (res.code === 200) {
          getFileList()
        } else {
          message.error(res.msg)
        }
      })
  }

  useEffect(() => {
    setCloneCurrentIten(cloneDeep(currentItem))
  }, [currentItem])

  return (
    <>
      <div
        className={`fixed  left-[45%] animate__animated animate__faster
    ${show ? 'animate__fadeInUp  bottom-[50px]' : 'bottom-[50px] animate__fadeOutDown'}
      ${show1 ? '' : 'hidden'}
      `}>
        <div className="px-4 py-3 flex w-[340px] items-center justify-evenly rounded-lg bg-[#313136] text-white ">
          <div className="cursor-pointer">
            <Tooltip
              title="快传"
              arrow={false}>
              <CloudDownloadOutlined />
            </Tooltip>
          </div>
          <div className="cursor-pointer">
            <Tooltip
              title="移至资源库"
              arrow={false}>
              <ExportOutlined />
            </Tooltip>
          </div>
          <div
            className="cursor-pointer"
            onClick={donwload}>
            <Tooltip
              title="下载"
              arrow={false}>
              <DownloadOutlined />
            </Tooltip>
          </div>
          <div
            className="cursor-pointer relative top-[3px]"
            onClick={collection}>
            <Tooltip
              title="收藏"
              arrow={false}>
              {cloneCurrentItem?.isCollection === 0 ? (
                <CcIcon>
                  <Heart16Regular />
                </CcIcon>
              ) : (
                <CcIcon>
                  <Heart16Filled color="red" />
                </CcIcon>
              )}
            </Tooltip>
          </div>
          <div
            className="cursor-pointer"
            onClick={delFile}>
            <Tooltip
              title="放入回收站"
              arrow={false}>
              <DeleteOutlined />
            </Tooltip>
          </div>
          <div className="cursor-pointer">
            <Tooltip
              title="更多"
              arrow={false}>
              <EllipsisOutlined />
            </Tooltip>
          </div>
          <div
            className="cursor-pointer"
            onClick={cancelCheck}>
            <Tooltip
              title="取消多选"
              arrow={false}>
              <CloseCircleOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
      <DownloadModal
        item={currentItem}
        visible={visible}
        close={() => setVisible(false)}></DownloadModal>
      {contextHolder}
    </>
  )
}

export default ActionPopover
