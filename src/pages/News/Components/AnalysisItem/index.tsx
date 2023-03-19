/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import excel from '../../../../assets/news/excel.svg'
import more from '../../../../assets/news/more.svg'
import pdf from '../../../../assets/news/pdf.svg'
import word from '../../../../assets/news/word.svg'
import styles from './index.module.less'

export function AnalysisItem(props) {
  const { item, index, isHide = false, getIndex } = props
  const navigate = useNavigate()
  return (
    <>
      <div className={styles.analysisItem} key={index}>
        <div
          className={styles.analysisItemLeft}
          onClick={() => {
            !isHide &&
              navigate(`/news/newsDetail?detailId=${index}&title=${item.name}`)
          }}
        >
          <img
            src={
              item.type === 'word' ? word : item.type === 'excel' ? excel : pdf
            }
          />
          <div className={styles.analysisItemLeftMain}>
            <div className={styles.analysisItemTitle}>{item.name}</div>
            <div className={styles.analysisItemTime}>
              {item.UpdatedBy}更新于{item.Updated}
            </div>
          </div>
        </div>
        {!isHide && (
          <div
            className={styles.analysisItemRight}
            onClick={() => {
              getIndex(index)
            }}
          >
            <img src={more} />
          </div>
        )}
      </div>
    </>
  )
}
