import { Icon } from '@ricons/utils'
import { ReactNode } from 'react'

interface Props {
  color?: string
  size?: number
  children: ReactNode
}

const CcIcon = (props: Props) => {
  const { color, size = 18, children } = props
  return (
    <Icon
      size={size}
      color={color}>
      {children}
    </Icon>
  )
}

export default CcIcon
