import { FileItem } from '@/types/file'
import { ArrowLeftOutlined, ArrowRightOutlined, LeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ZoomOut16Regular, ZoomIn16Regular } from '@ricons/fluent'
import CcIcon from '@/components/icon/CcIcon'
import { Divider, Tooltip } from 'antd'

const FileDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fileList = (location.state.fileList as FileItem[]).filter(item => item.isDir === 0)
  const [currentIndex, setCurrentIndex] = useState(-1)
  let [size, setSize] = useState(100)

  useEffect(() => {
    setCurrentIndex(fileList.findIndex(item => item.id === location.state.item.id))
  }, [])

  return fileList.length && currentIndex >= 0 ? (
    <>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #eee' }}>
        <div className="flex items-center">
          <div
            className="cursor-pointer"
            onClick={() => navigate(-1)}>
            <LeftOutlined />
          </div>
          <div className="ml-[10px]">{fileList[currentIndex]?.name}</div>
        </div>
        <div className="flex justify-center items-center flex-1">
          {fileList[currentIndex]?.type === 'image' ? (
            <>
              <div
                className="flex items-center"
                onClick={() => setSize((size -= 10))}>
                <CcIcon color="#25262bb7">
                  <ZoomOut16Regular />
                </CcIcon>
              </div>
              <div className="text-xs mx-3 w-[40px] text-center">{`${size}%`}</div>
              <div
                className="flex items-center"
                onClick={() => setSize((size += 10))}>
                <CcIcon color="#25262bb7">
                  <ZoomIn16Regular />
                </CcIcon>
              </div>
            </>
          ) : null}
        </div>
        <div className="flex items-center">
          <Tooltip
            title="上一项"
            arrow={false}
            placement="top">
            <div
              className="cursor-pointer mr-5"
              onClick={() => {
                let index = currentIndex
                index--
                if (index < 0) {
                  index = fileList.length - 1
                }
                setCurrentIndex(index)
              }}>
              <ArrowLeftOutlined className="text-[#25262bb7]" />
            </div>
          </Tooltip>
          <Tooltip
            title="下一项"
            arrow={false}
            placement="top">
            <div
              className="cursor-pointer mr-3"
              onClick={() => {
                let index = currentIndex
                index++
                if (index === fileList.length) {
                  index = 0
                }
                setCurrentIndex(index)
              }}>
              <ArrowRightOutlined className="text-[#25262bb7]" />
            </div>
          </Tooltip>
          <Divider type="vertical" />
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={fileList[currentIndex]?.url}
          width={fileList[currentIndex]?.width! * (size / 100)}
          height={fileList[currentIndex]?.height! * (size / 100)}
          alt=""
        />
      </div>
    </>
  ) : null
}

export default FileDetail
