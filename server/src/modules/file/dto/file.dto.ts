import { Stream } from 'node:stream'

export interface UploadFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  path: string
  buffer: Stream
}
