import {
  ClockCircleOutlined,
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileOutlined,
  HeartOutlined,
  TabletOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const NavSider = () => {
  const navigate = useNavigate()

  const items: MenuItem[] = [
    getItem('文件', 'file', <FileOutlined />, [
      getItem('最常使用', '/', <ClockCircleOutlined />),
      getItem('我的资料', '/information', <CopyOutlined />),
    ]),
    getItem('相册', '/album', <FileImageOutlined />),
    getItem('收藏', '/collect', <HeartOutlined />),
    getItem('密码箱', '/password', <DatabaseOutlined />),
    getItem('订阅', '/subscribe', <TabletOutlined />),
    getItem('回收站', '/recycle', <DeleteOutlined />),
  ]

  return (
    <Menu
      className='h-full bg-[#F5F5F6]'
      defaultSelectedKeys={['/']}
      defaultOpenKeys={['file']}
      mode='inline'
      items={items}
      onClick={({ key }) => {
        navigate(key)
      }}
    />
  )
}

export default NavSider
