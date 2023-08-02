import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import Layouts from './pages/layouts/Layouts'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import File from './pages/file/File'
import Login from './pages/login/Login'

const Routes = () => {
  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <Layouts />,
      children: [
        {
          path: '/',
          element: <File />,
        },
      ],
    },
  ])

  return routes
}

const App = () => {
  return (
    <ConfigProvider locale={zh_CN}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
