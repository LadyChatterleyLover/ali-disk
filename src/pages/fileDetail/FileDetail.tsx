import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DocViewer, { PDFRenderer, TXTRenderer } from 'react-doc-viewer'
import axios from 'axios'
import { FileItem } from '@/types/file'
import { ArrowLeftOutlined, ArrowRightOutlined, LeftOutlined } from '@ant-design/icons'
import { ZoomOut16Regular, ZoomIn16Regular } from '@ricons/fluent'
import CcIcon from '@/components/icon/CcIcon'
import { Button, Divider, Tooltip } from 'antd'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'
import DownloadModal from '@/components/file/DownloadModal'
import { plainType } from '@/const'

const FileDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fileList = (location.state.fileList as FileItem[]).filter(item => item.isDir === 0)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [downloadVisible, setDownloadVisible] = useState(false)
  const [content, setContent] = useState('')
  let [size, setSize] = useState(100)

  useEffect(() => {
    const currentIndex = fileList.findIndex(item => item.id === location.state.item.id)
    const item = fileList[currentIndex]
    axios
      .get(item.url, {
        responseType: 'text',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
      .then(res => {
        setContent(res.data)
      })
    setCurrentIndex(currentIndex)
  }, [])

  const renderContent = () => {
    const item = fileList[currentIndex]
    if (item.type === 'image') {
      return (
        <img
          src={fileList[currentIndex]?.url}
          width={fileList[currentIndex]?.width! * (size / 100)}
          height={fileList[currentIndex]?.height! * (size / 100)}
          alt=""
        />
      )
    } else if (item.ext === 'txt') {
      return (
        <DocViewer
          pluginRenderers={[TXTRenderer]}
          documents={[
            {
              uri: item.url,
            },
          ]}></DocViewer>
      )
    } else if (item.ext === 'pdf') {
      return (
        <DocViewer
          pluginRenderers={[PDFRenderer]}
          documents={[
            {
              uri: item.url,
            },
          ]}></DocViewer>
      )
    } else if (item.type === 'other') {
      return (
        <div className="flex flex-col justify-center items-center">
          <img
            width={92}
            height={92}
            src="	https://img.alicdn.com/imgextra/i2/O1CN01ROG7du1aV18hZukHC_!!6000000003334-2-tps-140-140.png"
            alt=""
          />
          <div className="text-sm font-bold my-3">{item.name}</div>
          <div className="text-[#25262b5b] text-xs">暂不支持在线预览，我们会持续优化，敬请期待</div>
          <div className="mt-8">
            <Button
              type="primary"
              onClick={() => setDownloadVisible(true)}>
              下载 {useFormatFileSize(item.size)}
            </Button>
          </div>
        </div>
      )
    }
    return null
  }

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
      <div className="w-full h-[65%] flex justify-center items-center">{renderContent()}</div>
      <DownloadModal
        item={fileList[currentIndex]}
        visible={downloadVisible}
        close={() => setDownloadVisible(false)}></DownloadModal>
    </>
  ) : null
}

export default FileDetail
