import { Button, Form, Input, message } from 'antd'
import Logo from '../../assets/logo.png'
import api from '../../api'
import { localSet } from '@/utils/util'
import { useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'

type FieldType = {
  username?: string
  password?: string
}

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const login = () => {
    const { username, password } = form.getFieldsValue()
    if (!username) {
      message.warning('用户名不能为空')
      return
    }
    if (!password) {
      message.warning('密码不能为空')
      return
    }
    api.user
      .login({
        username,
        password,
      })
      .then(res => {
        if (res.code === 200) {
          message.success(res.msg)
          localSet('disk-token', res.data.token)
          localSet('disk-user', res.data.user)
          navigate('/')
          ipcRenderer.invoke('resizeWindow')
        }
      })
  }

  return (
    <div className='h-full bg-[#ecefff] p-[50px] flex flex-col items-center'>
      <div className='mb-5'>
        <img src={Logo} width={260} height={60} alt='' />
      </div>
      <div className='bg-white p-5'>
        <Form form={form} style={{ width: 300 }} autoComplete='off'>
          <Form.Item<FieldType> name='username'>
            <Input placeholder='请输入用户名' size='large' />
          </Form.Item>

          <Form.Item<FieldType> name='password'>
            <Input.Password placeholder='请输入密码' size='large' />
          </Form.Item>

          <Form.Item>
            <Button
              className='bg-gradient-to-r from-[#4870FF] via-[#6181FF] to-[#8198FF] py-5 flex items-center justify-center text-base'
              type='primary'
              block
              onClick={login}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
