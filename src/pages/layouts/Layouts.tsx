import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'
import { ipcRenderer } from 'electron'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavSider from '../../components/navSider/NavSider'

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const Layouts = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('disk-user')
    if (!user) {
      navigate('/login')
    } else {
      ipcRenderer.invoke('resizeWindow')
    }
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ background: '#F5F5F6' }}>
        <NavSider />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Layouts
