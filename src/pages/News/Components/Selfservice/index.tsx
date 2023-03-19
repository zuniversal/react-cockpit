/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 15:18:23
 * @LastEditors: Teemor
 */
import { Toast, Dialog, Input } from 'antd-mobile'
import copy from 'copy-to-clipboard'
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import collection from '../../../../assets/news/collection.svg'
import more from '../../../../assets/news/more2.svg'
import news from '../../../../assets/news/news.svg'
import qq from '../../../../assets/news/qq.svg'
import share from '../../../../assets/news/share.svg'
import share1 from '../../../../assets/news/share1.svg'
import url from '../../../../assets/news/url.svg'
import wx from '../../../../assets/news/wx.svg'
import notifyEmptyImg from '../../../../assets/notify/notifyEmptyImg.svg'
import { ActionSheet } from '../../../../components/actionSheet'
import { Empty } from '@/apps/empty'
import workStyles from '../workItem.module.less'
import styles from './index.module.less'
export function Selfservice(props) {
  const { data } = props
  const navigate = useNavigate()
  const [visible, setVisible] = useState<boolean>(false)
  const [shareVisible, setShareVisible] = useState<boolean>(false)

  const actions = useMemo(() => {
    return [
      {
        icon: share1,
        name: '分享',
        event: () => {
          setVisible(false)
          setShareVisible(true)
        },
      },
      {
        icon: url,
        name: '复制链接',
        event: () => {
          copy('复制的内容')
          Toast.show({
            icon: 'success',
            content: '复制成功!',
          })
          setVisible(false)
        },
      },
      {
        icon: collection,
        name: '收藏',
        event: () => {
          Toast.show({
            icon: 'success',
            content: '收藏成功!',
          })
          setVisible(false)
        },
      },
    ]
  }, [])

  const shareActions = useMemo(() => {
    return [
      {
        icon: share,
        name: '分享到聊天',
        event: () => {},
      },
      {
        icon: wx,
        name: '微信',
        event: () => {},
      },
      {
        icon: qq,
        name: 'qq',
        event: () => {},
      },
    ]
  }, [])

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
      <div className={styles.selfservice}>
        {data.map((item, index) => {
          return (
            <div className={styles.selfserviceItem} key={index}>
              <div className={styles.selfserviceItemBox}>
                <div
                  className={styles.selfserviceItemTop}
                  onClick={() => {
                    navigate(
                      `/news/newsDetail?detailId=${index}&title=${item.name}`
                    )
                  }}
                >
                  <img src={news} />
                </div>
                <div className={styles.selfserviceItemBottom}>
                  <div
                    className={styles.selfserviceTitle}
                    onClick={() => {
                      navigate(
                        `/news/newsDetail?detailId=${index}&title=${item.name}`
                      )
                    }}
                  >
                    {item.name}
                  </div>
                  <div className={styles.selfserviceItemTime}>
                    {item.time}
                    <img
                      src={more}
                      onClick={() => {
                        setVisible(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* 动作控制板 */}
      <ActionSheet
        visible={visible}
        mainBox={
          <div className={workStyles.actionSheetList}>
            {actions.map((item, index) => {
              return (
                <div
                  className={workStyles.actionSheetListItem}
                  key={index}
                  onClick={item.event}
                >
                  <img src={item.icon} />
                  {item.name}
                </div>
              )
            })}
          </div>
        }
        getVisible={(v) => {
          setVisible(v)
        }}
      />
      {/* 分享 */}
      <ActionSheet
        visible={shareVisible}
        mainBox={
          <div className={workStyles.actionSheetShare}>
            <div className={workStyles.actionSheetShareTitle}>
              分享文件
              <span
                onClick={() => {
                  navigate('/news/permission')
                }}
              >
                所有岗位可见
              </span>
            </div>
            <div className={workStyles.actionSheetShareList}>
              {shareActions.map((item, index) => {
                return (
                  <div
                    className={workStyles.actionSheetShareListItem}
                    key={index}
                    onClick={item.event}
                  >
                    <img src={item.icon} />
                    {item.name}
                  </div>
                )
              })}
            </div>
          </div>
        }
        getVisible={(v) => {
          setShareVisible(v)
        }}
        title={
          <div
            style={{
              textAlign: 'center',
              width: '100%',
              padding: '10px 0 10px 50px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              分享
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
              2022年某某某莫白皮书
            </div>
          </div>
        }
      />
    </>
  )
}
