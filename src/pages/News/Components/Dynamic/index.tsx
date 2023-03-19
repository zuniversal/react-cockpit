/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import { Skeleton } from 'antd-mobile'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import notifyEmptyImg from '../../../../assets/notify/notifyEmptyImg.svg'
import { Empty } from '@/apps/empty'
import styles from './index.module.less'
export function Dynamic(props) {
  const { data } = props
  const navigate = useNavigate()
  const [visible, setVisible] = useState<boolean>(false)

  if (!data.length) {
    return (
      <Empty
        marginTop="60"
        src={notifyEmptyImg}
        paddingTop="50"
        paddingBottom="50"
      >
        还没有收藏
      </Empty>
    )
  }
  return (
    <>
      <div className={styles.Dynamic}>
        {data.map((item, index) => {
          return (
            <div
              className={styles.DynamicItem}
              key={index}
              onClick={() => {
                navigate(
                  `/news/newsDetail?detailId=${index}&title=${item.name}`
                )
              }}
            >
              {index === 0 ? (
                <>
                  <div className={styles.DynamicItemTitle}>{item.name}</div>
                  <div className={styles.DynamicItemImg}>
                    <img src={item.img} />
                  </div>
                  <div className={styles.DynamicItemTime}>{item.time}</div>
                </>
              ) : (
                <div className={styles.DynamicItemContent}>
                  <div className={styles.DynamicItemContentLeft}>
                    <div className={styles.DynamicItemTitle}>{item.name}</div>
                    <div className={styles.DynamicItemTime}>{item.time}</div>
                  </div>
                  <div className={styles.DynamicItemImg}>
                    <img src={item.img} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
