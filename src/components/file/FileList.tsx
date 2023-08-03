import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash-es'
import { audioType, imageType, videoType } from '@/const'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'
import { FileItem } from '@/types/file'
import { Dropdown, MenuProps, Table, TableProps, Tooltip } from 'antd'
import dayjs from 'dayjs'
import pdfImg from '../../assets/pdf.png'
import audioImg from '../../assets/audio.png'
import excelImg from '../../assets/excel.png'
import docxImg from '../../assets/docx.png'
import videoImg from '../../assets/video.png'
import zipImg from '../../assets/zip.png'
import {
  CheckOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  ExportOutlined,
  HeartOutlined,
  MinusOutlined,
} from '@ant-design/icons'

interface Props {
  fileList: FileItem[]
}

const FileList = (props: Props) => {
  const { fileList } = props
  const [cloneFileList, setCloneFileList] = useState<FileItem[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [selectList, setSelectList] = useState<FileItem[]>([])
  const [currentItem, setCurrentItem] = useState<FileItem>()
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuX, setMenuX] = useState(0)
  const [menuY, setMenuY] = useState(0)
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)

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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '快传',
    },
    {
      key: '2',
      label: '下载',
    },
    {
      key: '3',
      label: '收藏',
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: '重命名',
    },
    {
      key: '5',
      label: '移动',
    },
    {
      key: '6',
      label: '移到密码箱',
    },
    {
      key: '7',
      label: '移至资源库',
    },
    {
      key: '8',
      label: '查看详细信息',
    },
    {
      type: 'divider',
    },
    {
      key: '9',
      label: '放入回收站',
      danger: true,
    },
  ]

  const renderRow = (row: FileItem) => {
    if (row.isDir === 1) {
      return (
        <div className='flex items-center'>
          <img
            width={28}
            height={28}
            src='https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png'
          ></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (imageType.includes(row.ext)) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={row.url}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (row.ext === 'txt') {
      return (
        <div className='flex items-center'>
          <img
            width={28}
            height={28}
            src='https://img.alicdn.com/imgextra/i2/O1CN01kHskgT2ACzipXL4Ra_!!6000000008168-2-tps-80-80.png'
          ></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (row.ext === 'pdf') {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={pdfImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('.sheet')) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={excelImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('.document')) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={docxImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (row.ext.includes('zip')) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={zipImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (videoType.includes(row.ext.toLowerCase())) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={videoImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else if (audioType.includes(row.ext.toLowerCase())) {
      return (
        <div className='flex items-center'>
          <img width={28} height={28} src={audioImg}></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    } else {
      return (
        <div className='flex items-center'>
          <img
            width={28}
            height={28}
            src='https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png'
          ></img>
          <div className='ml-3'>{row.name}</div>
        </div>
      )
    }
    return row.name
  }

  const rowClassName = (record: FileItem) => {
    return record.checked ? 'bg-[#ecefff]' : ''
  }

  // 右键菜单点击事件处理函数
  const handleMenuClick: MenuProps['onClick'] = e => {
    console.log('Menu clicked:', e.key)
    setMenuVisible(false)
  }

  // 表格行右键点击事件处理函数
  const handleRowContextMenu = (record: FileItem, e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentItem(record)
    setMenuVisible(true)
    setMenuX(e.clientX)
    setMenuY(e.clientY)
  }

  const handleRowClick = (record: FileItem, index: number) => {
    const arr = []
    cloneFileList.map(item => {
      item.checked = false
    })
    cloneFileList[index].checked = true
    arr.push(record)
    setSelectList([...arr])
    setCloneFileList([...cloneFileList])
    setCurrentItem({ ...record })
    setShow(true)
    setShow1(true)
    console.log(record)
  }

  const cancelCheck = () => {
    const index = cloneFileList.findIndex(item => item.id === currentItem?.id)
    cloneFileList[index].checked = false
    setSelectList([])
    setCloneFileList([...cloneFileList])
    setCurrentItem(undefined)
    setShow(false)
    setTimeout(() => {
      setShow1(false)
    }, 500)
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

  useEffect(() => {
    setCloneFileList(cloneDeep(fileList))
  }, [fileList])

  return (
    <div className='py-7'>
      <div className='mb-5 flex items-center justify-between'>
        <div className='flex items-center'>
          <div
            className='h-4 w-4 rounded-full flex items-center justify-center'
            style={{
              border: '2px solid rgba(132, 133, 141, .2)',
              background: selectList.length ? '#637dff' : '#fff',
            }}
            onClick={handleSelectAll}
          >
            {selectList.length === cloneFileList.length ? (
              <CheckOutlined style={{ fontSize: 12, color: '#fff' }} />
            ) : (
              <MinusOutlined style={{ fontSize: 12, color: '#fff' }} />
            )}
          </div>
          <div className='ml-2 text-xs'>
            {selectList.length ? `已选 ${selectList.length} 项` : `共 ${cloneFileList.length} 项`}
          </div>
        </div>
      </div>
      <div className='overflow-auto' style={{ height: 'calc(100% - 50px)' }}>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={cloneFileList}
          pagination={false}
          rowClassName={rowClassName}
          onRow={(record, index) => ({
            onContextMenu: e => handleRowContextMenu(record, e),
            onClick: () => handleRowClick(record, index as number),
          })}
        />
        {menuVisible && (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            open={menuVisible}
            onOpenChange={visible => setMenuVisible(visible)}
            overlayStyle={{ position: 'absolute', left: menuX, top: menuY }}
          >
            <div style={{ width: 0, height: 0, overflow: 'hidden' }}></div>
          </Dropdown>
        )}
      </div>

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
          <div className='cursor-pointer'>
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
    </div>
  )
}

export default FileList
