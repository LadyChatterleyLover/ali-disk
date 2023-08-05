import { audioType, imageType, videoType } from '@/const'
import { FileItem } from '@/types/file'
import dayjs from 'dayjs'
import pdfImg from '../../assets/pdf.png'
import audioImg from '../../assets/audio.png'
import excelImg from '../../assets/excel.png'
import docxImg from '../../assets/docx.png'
import videoImg from '../../assets/video.png'
import zipImg from '../../assets/zip.png'
import { useNavigate } from 'react-router-dom'

interface Props {
  fileList: FileItem[]
}

const FileList = (props: Props) => {
  const navigate = useNavigate()
  const { fileList } = props

  const renderRow = (row: FileItem) => {
    if (row.isDir === 1) {
      return (
        <div className="flex flex-col items-center w-full h-[90px]">
          <img
            width={90}
            height={90}
            src="https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png"></img>
        </div>
      )
    } else if (imageType.includes(row.ext)) {
      return (
        <div className="flex flex-col justify-center items-center w-full h-[90px]">
          <img
            width={row.width}
            height={row.height}
            src={row.url}></img>
        </div>
      )
    } else if (row.ext === 'txt') {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src="https://img.alicdn.com/imgextra/i2/O1CN01kHskgT2ACzipXL4Ra_!!6000000008168-2-tps-80-80.png"></img>
        </div>
      )
    } else if (row.ext === 'pdf') {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={pdfImg}></img>
        </div>
      )
    } else if (row.ext.includes('.sheet')) {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={excelImg}></img>
        </div>
      )
    } else if (row.ext.includes('.document')) {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={docxImg}></img>
        </div>
      )
    } else if (row.ext.includes('zip')) {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={zipImg}></img>
        </div>
      )
    } else if (videoType.includes(row.ext.toLowerCase())) {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={videoImg}></img>
        </div>
      )
    } else if (audioType.includes(row.ext.toLowerCase())) {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src={audioImg}></img>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center">
          <img
            className="w-full"
            height={90}
            src="https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png"></img>
        </div>
      )
    }
  }

  return (
    <div className="flex items-center flex-wrap">
      {fileList.map(item => {
        return (
          <div
            key={item.id}
            className="flex flex-col items-center justify-center p-2 w-[20%]"
            onDoubleClick={() => {
              navigate('/fileDetail', {
                state: {
                  item,
                  fileList: fileList,
                },
              })
            }}>
            {renderRow(item)}
            <div className="my-3">{item.name}</div>
            <div className="text-xs text-[#25262b5b]">
              {dayjs(item.updateAt).format('MM/DD hh:mm')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FileList
