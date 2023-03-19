/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import { Collapse } from 'antd-mobile'
import React, { useState } from 'react'

import icon1 from '../../../../assets/news/icon1.svg'
import right from '../../../../assets/news/right.svg'
import select from '../../../../assets/news/select.svg'
import styles from './index.module.less'
export function WorkItem(props) {
  const { data, isSelect = false } = props
  const [list, setList] = useState<any[]>(data)
  return (
    <>
      {list?.map((listItem, l) => {
        return (
          <div className={styles.workBox} key={l}>
            <Collapse
              accordion
              defaultActiveKey="0"
              arrow={<img src={right} className={styles.workTitleRight} />}
            >
              <Collapse.Panel
                key={l + ''}
                title={
                  <div className={styles.workTitleLeft}>
                    <img src={icon1} />
                    {listItem.name}
                  </div>
                }
              >
                <div className={styles.workMain}>
                  {listItem?.children?.map((item, index) => {
                    return (
                      <div className={styles.workMainItem} key={index}>
                        <div className={styles.workMainItemTitle}>
                          {item.name}
                        </div>
                        <div className={styles.workMainItemBox}>
                          {item.children.map((child, c) => {
                            return (
                              <div
                                className={`${styles.workMainItemBoxItem} ${
                                  child.active && styles.active
                                }`}
                                onClick={() => {
                                  if (isSelect) {
                                    list[l].children[index].children[c].active =
                                      !child.active
                                    setList([...list])
                                  }
                                }}
                                key={c}
                              >
                                {child.name}
                                {child.active && <img src={select} />}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        )
      })}
    </>
  )
}
