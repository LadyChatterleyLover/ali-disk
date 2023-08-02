import type { UserInfo } from './user'

export interface FileItem {
  id?: number
  name: string
  ext: string
  url: string
  isDir: number
  dirId?: number
  size: number
  createAt: string
  updateAt: string
  checked: boolean
  isAdd: boolean
  isRename: boolean
  isShared: number
  shareUrl: string
  extractedCode: string
  viewCount: number
  children?: FileItem[]
  user?: UserInfo
}
