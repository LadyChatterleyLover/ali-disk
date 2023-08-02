export function localGet(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  } catch {
    return value
  }
}

/**
 * 存储localStorage
 * @param key Storage名称
 * @param value Storage值
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 清除localStorage
 * @param key Storage名称
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key)
}

export function download(
  blobUrl: string,
  tempName?: string,
  fileType?: string
) {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.download = `${tempName}${fileType}`
  a.href = blobUrl
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(blobUrl)
}
