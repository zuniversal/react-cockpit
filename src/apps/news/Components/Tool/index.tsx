/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import React, { useState, useEffect } from 'react'

import add from '../../../../assets/news/add.svg'
import funnel from '../../../../assets/news/funnel.svg'
import styles from './index.module.less'
export function Tool(props) {
  const { getCollection, getActions, cardIndex, collectionIndex = 0 } = props
  const [toolIndex, setToolIndex] = useState<number>(0)
  const toolList = ['全部', '收藏']
  useEffect(() => {
    setToolIndex(collectionIndex)
  }, [collectionIndex])
  return (
    <div className={styles.cardTool}>
      <div className={styles.cardToolLeft}>
        {toolList.map((item, index) => {
          return (
            <div
              className={`${styles.cardToolLeftItem} ${
                toolIndex === index && styles.active
              }`}
              key={index}
              onClick={() => {
                setToolIndex(index)
                getCollection(index)
              }}
            >
              {item}
            </div>
          )
        })}
      </div>
      {!cardIndex && (
        <div className={styles.cardToolRight}>
          <img
            src={funnel}
            alt=""
            onClick={() => {
              getActions('funnel')
            }}
          />
          <img
            src={add}
            alt=""
            onClick={() => {
              getActions('add')
            }}
          />
        </div>
      )}
    </div>
  )
}
