/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2022-12-15 08:57:39
 * @LastEditors: Teemor
 */
import { SearchBar } from 'antd-mobile'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import close from '../../../assets/news/close.svg'
import { Example } from '../../../components/example'
import { HeadTitle } from '../../../components/helmet'
import { CardMode } from '../Components'
import styles from './index.module.less'
export default function SearchNews() {
  const [search] = useSearchParams()
  const searchType = search.get('searchType')
  const [searchStatus, setSearchStatus] = useState<boolean>(false)
  const [editStatus, setEditStatus] = useState<boolean>(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '搜索历史文字1',
    '搜索历史文字文字2',
    '搜索历史文字3',
    '搜索历史文字文字4',
    '搜索历史文字5',
    '搜索历史文字文字6',
    '搜索历史文字7',
    '搜索历史文字文字8',
    '搜索历史文字9',
    '搜索历史文字文字文字10',
    '搜索历史文字11',
    '搜索历史文字文字文字12',
  ])
  return (
    <div className={styles.searchNews}>
      <HeadTitle>搜索-</HeadTitle>
      <div className={styles.searchNewsBox}>
        <SearchBar
          placeholder="请输入内容"
          onSearch={() => {
            setSearchStatus(true)
          }}
        />
        {!searchStatus && (
          <div className={styles.searchHistory}>
            <div className={styles.searchHistoryTitle}>
              搜索历史
              {editStatus ? (
                <span
                  className={styles.searchHistoryTitleClose}
                  onClick={() => {
                    setEditStatus(false)
                  }}
                >
                  完成
                </span>
              ) : (
                <span
                  onClick={() => {
                    setEditStatus(true)
                  }}
                >
                  编辑
                </span>
              )}
            </div>
            <div className={styles.searchHistoryList}>
              {searchHistory.map((item, i) => {
                return (
                  <div className={styles.searchHistoryItem} key={i}>
                    {item}
                    {editStatus && (
                      <img
                        src={close}
                        alt=""
                        onClick={() => {
                          setSearchHistory(
                            searchHistory.filter((i) => i !== item)
                          )
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {searchStatus && <CardMode isSearch searchType={searchType} />}

      <Example />
    </div>
  )
}
