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
import AllPic from './pages/allPic/AllPic'
import Share from './pages/share/Share'
import QuickUpload from './pages/quickUpload/QuickUpload'
import UploadFile from './pages/uploadFile/UploadFile'
import DownloadFile from './pages/downloadFile/DownloadFile'

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
          path: '/allPic',
          element: <AllPic />,
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
        {
          path: '/share',
          element: <Share />,
        },
        {
          path: '/quickUpload',
          element: <QuickUpload />,
        },
        {
          path: '/uploadFile',
          element: <UploadFile />,
        },
        {
          path: '/downloadFile',
          element: <DownloadFile />,
        },
        {
          path: '/quickUpload',
          element: <QuickUpload />,
        },
      ],
    },
  ])

  return routes
}

const App = () => {
  return (
    <ConfigProvider locale={zh_CN} theme={{ token: { colorPrimary: '#637dff' } }}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
