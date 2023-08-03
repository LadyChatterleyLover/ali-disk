import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  ControlOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileImageOutlined,
  FileOutlined,
  HeartOutlined,
  LoginOutlined,
  ShareAltOutlined,
  TabletOutlined,
  UploadOutlined,
  UsbOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type MenuItem = {
  icon: any
  name: string
  path?: string
  children?: MenuItem[]
}

const NavSider = () => {
  const menuList: MenuItem[] = [
    {
      name: '文件',
      icon: <FileOutlined />,
      children: [
        {
          name: '备份盘',
          path: '/',
          icon: <TabletOutlined />,
        },
        {
          name: '资源库',
          path: '/information',
          icon: <ExportOutlined />,
        },
      ],
    },
    {
      name: '相册',
      icon: <FileImageOutlined />,
      children: [
        {
          name: '全部照片',
          icon: <FileImageOutlined />,
          path: '/allPic',
        },
        {
          name: '我的相册',
          icon: <CreditCardOutlined />,
          path: '/album',
        },
      ],
    },
    {
      name: '应用',
      icon: <AppstoreOutlined />,
      children: [
        {
          name: '回收站',
          icon: <DeleteOutlined />,
          path: '/recycle',
        },
        {
          name: '密码箱',
          icon: <ControlOutlined />,
          path: '/password',
        },
        {
          name: '我的分享',
          icon: <ShareAltOutlined />,
          path: '/recycle',
        },
        {
          name: '我的快传',
          icon: <CloudDownloadOutlined />,
          path: '/quickUpload',
        },
        {
          name: '我的收藏',
          icon: <HeartOutlined />,
          path: '/collect',
        },
        {
          name: '我的订阅',
          icon: <UsbOutlined />,
          path: '/subscribe',
        },
      ],
    },
    {
      name: '传输',
      icon: <LoginOutlined />,
      children: [
        {
          name: '上传',
          icon: <UploadOutlined />,
          path: '/uploadFile',
        },
        {
          name: '下载',
          icon: <DownloadOutlined />,
          path: '/downloadFile',
        },
        {
          name: '已完成',
          icon: <CheckCircleOutlined />,
          path: '/complete',
        },
      ],
    },
  ]
  const navigate = useNavigate()
  const [currentItem, setCurrentItem] = useState<MenuItem>(menuList[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentChildIndex, setCurrentChildIndex] = useState(0)

  return (
    <div className='flex w-[248px] h-full'>
      <div className='bg-[#F5F5F6] w-[78px]  h-full flex flex-col items-center'>
        <img
          src='https://img.alicdn.com/imgextra/i2/O1CN011vHpiQ251TseXpbH7_!!6000000007466-2-tps-120-120.png'
          alt='logo'
          width={40}
          height={40}
          className='mt-3 mb-3'
        />
        {menuList.map((item, index) => {
          return (
            <div
              key={index}
              className='text-[#25262bb7] w-[60px] h-[60px] mt-5 cursor-pointer flex flex-col items-center justify-center rounded-lg'
              style={{ background: currentIndex === index ? '#84858d28' : '' }}
              onClick={() => {
                setCurrentIndex(index)
                setCurrentItem(item)
                navigate(item.children![0].path as string)
              }}
            >
              <div className='text-[28px]'>{item.icon}</div>
              <div>{item.name}</div>
            </div>
          )
        })}
      </div>
      <div className='w-[170px] flex flex-col items-center pt-6'>
        {currentItem.children?.map((item, index) => {
          return (
            <div
              className='flex w-[140px] h-10 pl-2 leading-[14px] cursor-pointer items-center text-[#25262b] mb-3'
              style={{ background: currentChildIndex === index ? '#84858d28' : '' }}
              onClick={() => {
                setCurrentChildIndex(index)
                navigate(item.path as string)
              }}
            >
              <div className='text-xl mr-3'>{item.icon}</div>
              <div>{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NavSider
