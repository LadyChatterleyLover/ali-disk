import { get, post } from '../request'
import type { UserInfo } from '@/types/user'

export default {
  register(params: { username: string; password: string; email: string }) {
    return post<{
      token: string
      user: UserInfo
    }>('/user/register', params)
  },
  login(params: { username: string; password: string }) {
    return post<{
      token: string
      user: UserInfo
    }>('/user/login', params)
  },
  getUserInfo() {
    return get<UserInfo>('/user')
  },
}
