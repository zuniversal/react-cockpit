import { Tabs } from 'antd-mobile'
import type { TabProps, TabsProps } from 'antd-mobile/es/components/tabs'

import styles from './SegmentedControls.module.less'
export function SegmentedControls(
  props: TabsProps & {
    tabs: (TabProps & { key: string })[]
  }
) {
  const { tabs, ...tabsProps } = props
  return (
    <div
      className={styles.SegmentedControls}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 103,
        background: '#fff',
      }}
    >
      <Tabs {...tabsProps}>
        {tabs.map((tab) => {
          return (
            <Tabs.Tab
              key={tab.key}
              {...tab}
              className={styles.TabWrapper}
              style={{
                padding: 0,
              }}
            />
          )
        })}
      </Tabs>
    </div>
  )
}
