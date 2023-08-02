import { audioType, imageType, videoType } from '@/const'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'
import { FileItem } from '@/types/file'
import { Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import pdfImg from '../../assets/pdf.png'
import audioImg from '../../assets/audio.png'
import excelImg from '../../assets/excel.png'
import docxImg from '../../assets/docx.png'
import videoImg from '../../assets/video.png'
import zipImg from '../../assets/zip.png'
import { useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'

interface Props {
  fileList: FileItem[]
}

const FileList = (props: Props) => {
  const { fileList } = props
  const [selectAll, setSelectAll] = useState(false)
  const [selectList, setSelectList] = useState<FileItem[]>([])

  const columns: TableProps<FileItem>['columns'] = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      render: (_, row) => renderRow(row),
    },
    {
      title: '修改时间',
      key: 'updateAt',
      dataIndex: 'updateAt',
      align: 'center',
      sorter: (a, b) => dayjs(a.updateAt).valueOf() - dayjs(b.updateAt).valueOf(),
      render: (_, row) => dayjs(row.updateAt).format('MM/DD hh:mm'),
    },
    {
      title: '大小',
      key: 'size',
      dataIndex: 'size',
      align: 'center',
      render: (_, row) => (row.size ? useFormatFileSize(row.size) : '-'),
    },
  ]

  const renderRow = (row: FileItem) => {
    if (row.isDir === 1) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src="https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png"></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (imageType.includes(row.ext)) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={row.url}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (row.ext === 'txt') {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src="https://img.alicdn.com/imgextra/i2/O1CN01kHskgT2ACzipXL4Ra_!!6000000008168-2-tps-80-80.png"></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (row.ext === 'pdf') {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={pdfImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('.sheet')) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={excelImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('.document')) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={docxImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('zip')) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={zipImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (videoType.includes(row.ext.toLowerCase())) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={videoImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else if (audioType.includes(row.ext.toLowerCase())) {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src={audioImg}></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    } else {
      return (
        <div className="flex items-center">
          <img
            width={28}
            height={28}
            src="https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png"></img>
          <div className="ml-3">{row.name}</div>
        </div>
      )
    }
    return row.name
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    if (selectList.length !== fileList.length) {
      fileList.map(item => {
        item.checked = true
      })
      setSelectList(fileList)
    } else {
      fileList.map(item => {
        item.checked = false
      })
      setSelectList([])
    }
  }

  return (
    <div className="py-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="h-4 w-4 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(132, 133, 141, .2)',
              background: selectAll ? '#637dff' : '#fff',
            }}
            onClick={handleSelectAll}>
            {selectAll ? <CheckOutlined style={{ fontSize: 12, color: '#fff' }} /> : null}
          </div>
          <div className="ml-2 text-xs">
            {selectList.length ? `已选 ${selectList.length} 项` : `共 ${fileList.length} 项`}
          </div>
        </div>
      </div>
      <div
        className="overflow-auto"
        style={{ height: 'calc(100% - 50px)' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={fileList}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default FileList
