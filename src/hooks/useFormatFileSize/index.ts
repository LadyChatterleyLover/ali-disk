export const useFormatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size.toFixed(2)}B`
  } else if (size >= 1024 && size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  } else if (size >= 1024 && size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)}M`
  } else if (size >= 1024 && size < 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}G`
  } else if (size >= 1024 && size < 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(0)}T`
  }
  return size
}
