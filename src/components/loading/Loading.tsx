import { DotLoading } from 'antd-mobile'
import { CSSProperties } from 'react'

import styles from './Loading.module.less'

export function Loading(props: { style?: CSSProperties; color?: string }) {
  const { color = '#6E94F2' } = props
  return (
    <div className={styles.loadingContainer} style={props.style}>
      <DotLoading style={{ transform: 'scale(3)' }} color={color} />
    </div>
  )
}
