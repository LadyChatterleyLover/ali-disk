import { FileItem } from '@/types/file'
import { CheckOutlined, MinusOutlined } from '@ant-design/icons'
import { ArrowSort20Regular, Grid20Regular } from '@ricons/fluent'
import CcIcon from '../icon/CcIcon'
import { Tooltip } from 'antd'

interface Props {
  viewMode: 'table' | 'list'
  setViewMode: (val: 'table' | 'list') => void
  fileList: FileItem[]
  selectList: FileItem[]
  setSelectList: (list: FileItem[]) => void
}

const FileHeader = (props: Props) => {
  const { fileList, selectList, setSelectList, viewMode, setViewMode } = props

  const handleSelectAll = () => {
    if (selectList.length !== fileList.length) {
      fileList.map(item => {
        item.checked = true
      })
      setSelectList(fileList)
    } else {
      fileList.map(item => {
        item.checked = false
      })
      setSelectList([])
    }
  }
  return (
    <div className="mb-5 pl-3 pr-5 flex items-center justify-between">
      <div className="flex items-center">
        <div
          className="h-4 w-4 rounded-full flex items-center justify-center"
          style={{
            border: '2px solid rgba(132, 133, 141, .2)',
            background: selectList.length ? '#637dff' : '#fff',
          }}
          onClick={handleSelectAll}>
          {selectList.length === fileList.length ? (
            <CheckOutlined style={{ fontSize: 12, color: '#fff' }} />
          ) : (
            <MinusOutlined style={{ fontSize: 12, color: '#fff' }} />
          )}
        </div>
        <div className="ml-2 text-xs">
          {selectList.length ? `已选 ${selectList.length} 项` : `共 ${fileList.length} 项`}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center px-[10px] py-1 text-xs rounded-md cursor-pointer hover:bg-[#84858d14] hover:text-[#25262b]">
          <CcIcon color="#25262bb7">
            <ArrowSort20Regular></ArrowSort20Regular>
          </CcIcon>
          <div className="ml-[10px] text-[#25262bb7]">按创建时间排序</div>
        </div>
        <Tooltip
          title="切换视图"
          arrow={false}>
          <div
            className="ml-5 flex items-center p-1 text-xs rounded-md cursor-pointer hover:bg-[#84858d14] hover:text-[#25262b]"
            onClick={() => {
              setViewMode(viewMode === 'table' ? 'list' : 'table')
            }}>
            <CcIcon>
              <Grid20Regular></Grid20Regular>
            </CcIcon>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default FileHeader
