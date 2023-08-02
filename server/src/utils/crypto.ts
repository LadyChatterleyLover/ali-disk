import * as crypto from 'crypto'

const secret = 'abcdefg123456789'

// 加密
export function createPassword(password) {
  const hmac = crypto.createHash('sha256', secret as any)
  hmac.update(password)
  return hmac.digest('hex')
}

// 验证密码
export async function checkPassword(password, hash_password) {
  // 先对需要验证的密码进行加密
  password = await createPassword(password)
  return password === hash_password
}
