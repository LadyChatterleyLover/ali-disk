import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import Layouts from './pages/layouts/Layouts'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import File from './pages/file/File'
import Login from './pages/login/Login'
import Information from './pages/information/Information'
import Album from './pages/album/Album'
import Collect from './pages/collect/Collect'
import Password from './pages/password/Password'
import Subscribe from './pages/subscribe/Subscribe'
import Recycle from './pages/recycle/Recycle'
import Commonly from './pages/commonly/Commonly'

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
        {
          path: '/information',
          element: <Information />,
        },
        {
          path: '/commonly',
          element: <Commonly />,
        },
        {
          path: '/album',
          element: <Album />,
        },
        {
          path: '/collect',
          element: <Collect />,
        },
        {
          path: '/password',
          element: <Password />,
        },
        {
          path: '/subscribe',
          element: <Subscribe />,
        },
        {
          path: '/recycle',
          element: <Recycle />,
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
