/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 20:45:24
 * @LastEditors: Teemor
 */
import { SafeArea } from 'antd-mobile'
import ReactDOM from 'react-dom'

// import type { TabProps, TabsProps } from 'antd-mobile/es/components/tabs'
import styles from './index.module.less'
export function ActionSheet(props) {
  // visible 显示隐藏
  //title title 模块 dom
  // mainBox 内容模块 dom
  // getVisible 往父组件传值关闭
  //unclose 是否展示关闭按钮
  //uncancel 是否展示取消按钮
  const {
    visible = false,
    title,
    mainBox,
    getVisible,
    unclose = false,
    uncancel = false,
  } = props
  if (!mainBox) return null
  const handleVisible = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    getVisible(false)
  }
  return ReactDOM.createPortal(
    <div className={`${styles.actionSheet} ${visible && styles.active}`}>
      <div className={styles.actionSheetMain}>
        {title && (
          <div className={styles.actionSheetTitle}>
            {title}

            {!unclose && (
              <div
                className={styles.close}
                onClick={(e) => {
                  handleVisible(e)
                }}
              />
            )}
          </div>
        )}
        <div className={styles.actionSheetList}>{mainBox}</div>
        {uncancel ? (
          <div
            className={styles.complete}
            onClick={(e) => {
              handleVisible(e)
            }}
          >
            完成
          </div>
        ) : (
          <div
            className={styles.canvas}
            onClick={(e) => {
              handleVisible(e)
            }}
          >
            取消
          </div>
        )}
        <SafeArea position="bottom" />
      </div>
    </div>,
    document.body
  )
}
