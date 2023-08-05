import type { UserInfo } from './user'

export interface FileItem {
  id?: number
  name: string
  ext: string
  url: string
  width: number
  height: number
  isDir: number
  dirId?: number
  size: number
  createAt: string
  updateAt: string
  checked: boolean
  isAdd: boolean
  isRename: boolean
  isShared: number
  isCollection: number
  shareUrl: string
  extractedCode: string
  viewCount: number
  children?: FileItem[]
  user?: UserInfo
}
