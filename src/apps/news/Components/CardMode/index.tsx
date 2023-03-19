/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import news1 from '../../../../assets/news/news1.svg'
import news2 from '../../../../assets/news/news2.svg'
import news3 from '../../../../assets/news/news3.svg'
import search from '../../../../assets/news/search.svg'
import { Analysis, Tool, Selfservice, Dynamic } from '../index'
import styles from './index.module.less'
export function CardMode(props) {
  const { isSearch = false, searchType = 0 } = props
  const navigate = useNavigate()
  const [cardIndex, setCardIndex] = useState<number>(Number(searchType))
  const [collectionIndex, setCollectionIndex] = useState<number>(0)
  const [actions, setActions] = useState<string>('')

  const cardList = ['分析报告', '自助分析', '产品动态']
  const data = [
    {
      type: 'word',
      name: '2022年某某某莫白皮书',
      Updated: '2021-12-12',
      UpdatedBy: 'Teemor',
    },
    {
      type: 'excel',
      name: '2022年中国新能源汽车行业报告',
      Updated: '2022-10-22',
      UpdatedBy: '李四',
    },
    {
      type: 'pdf',
      name: '2022年中国新能源汽车行业报告',
      Updated: '2021-12-12',
      UpdatedBy: '王五一',
    },
  ]

  const SelfserviceData = [
    {
      name: '人效分析',
      time: '昨天 13:20',
    },
    {
      name: '人工成本',
      time: '昨天 13:10',
    },
    {
      name: '损耗成本',
      time: '昨天 13:00',
    },
    {
      name: '产品成本',
      time: '昨天 13:02',
    },
  ]
  const DynamicData = [
    {
      name: '正式上线！洞鉴 | 全域数据分析与探索平台',
      time: '今天 13:20',
      img: news1,
    },
    {
      name: '中创新航第一期自助分析训练营胜利召开',
      time: '今天 10:20',
      img: news2,
    },
    {
      name: '自助分析训练营 | 活动详情&培训大纲',
      time: '今天 13:20',
      img: news3,
    },
  ]
  const [AnalysisData, setAnalysisData] = useState(data)
  const [SelfserviceData2, setSelfserviceData] = useState(SelfserviceData)
  const [DynamicData2, setDynamicData] = useState(DynamicData)
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.cardLeft}>
          {cardList.map((item, index) => {
            return (
              <div
                className={`${styles.cardLeftItem} ${
                  cardIndex === index && styles.active
                }`}
                key={index}
                onClick={() => {
                  setCardIndex(index)
                  setCollectionIndex(0)

                  setAnalysisData(data)
                  setSelfserviceData(SelfserviceData)
                  setDynamicData(DynamicData)
                }}
              >
                {item}
              </div>
            )
          })}
        </div>
        {!isSearch && (
          <div
            className={styles.cardRight}
            onClick={() => {
              navigate(`/news/searchNews?searchType=${cardIndex}`)
            }}
          >
            <img src={search} />
            搜索
          </div>
        )}
      </div>
      <div className={styles.cardMain}>
        <Tool
          cardIndex={cardIndex}
          collectionIndex={collectionIndex}
          getCollection={(e) => {
            setCollectionIndex(e)
            setAnalysisData(!e ? data : [])
            setSelfserviceData(!e ? SelfserviceData : [])
            setDynamicData(!e ? DynamicData : [])
          }}
          getActions={(e) => {
            setActions(e)
          }}
        />
        {cardIndex === 0 ? (
          <Analysis
            data={AnalysisData}
            actionsEvent={actions}
            setActionsEvent={(e) => {
              setActions(e)
            }}
          />
        ) : cardIndex === 1 ? (
          <Selfservice data={SelfserviceData2} />
        ) : (
          <Dynamic data={DynamicData2} />
        )}
      </div>
    </div>
  )
}
