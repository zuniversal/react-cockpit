import React, { useState } from 'react'

import styles from './TabCard.module.less'

export const TabCard = (props) => {
  // console.log(props)
  const [active, setActive] = useState(true)
  const leftTabContent = props.tabCardContent.leftTabContent
  const rightTabContent = props.tabCardContent.rightTabContent
  const element = (
    <div className={styles.container}>
      <div
        className={styles.TabContainerLeft}
        style={{ backgroundColor: active ? '#4F72DD' : '#FAFAFA' }}
      >
        <div
          className={styles.TabFont}
          style={{ color: active ? '#FFFFFF' : '#587AE3' }}
          onClick={() => setActive(!active)}
        >
          {leftTabContent}
        </div>
      </div>
      <div
        className={styles.TabContainerRight}
        style={{ backgroundColor: !active ? '#4F72DD' : '#FAFAFA' }}
      >
        <div
          className={styles.TabFont}
          style={{ color: !active ? '#FFFFFF' : '#587AE3' }}
          onClick={() => setActive(!active)}
        >
          {rightTabContent}
        </div>
      </div>
    </div>
  )
  return element
}
