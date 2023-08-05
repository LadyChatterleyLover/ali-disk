import { App, Layout } from 'antd'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavSider from '@/components/navSider/NavSider'

const { Content, Sider } = Layout

const Layouts = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('disk-user')
    if (!user) {
      navigate('/login')
    } else {
      ipcRenderer.invoke('resizeWindow', 1300, 1000)
    }
  }, [])

  return (
    <App>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          width={248}
          theme="light">
          <NavSider />
        </Sider>
        <Layout>
          <Content style={{ background: '#fff' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </App>
  )
}

export default Layouts
