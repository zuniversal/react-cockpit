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
import edit from '../../../../assets/news/edit.svg'
import jurisdiction from '../../../../assets/news/jurisdiction.svg'
import qq from '../../../../assets/news/qq.svg'
import select from '../../../../assets/news/select.svg'
import share from '../../../../assets/news/share.svg'
import share1 from '../../../../assets/news/share1.svg'
import url from '../../../../assets/news/url.svg'
import wx from '../../../../assets/news/wx.svg'
import notifyEmptyImg from '../../../../assets/notify/notifyEmptyImg.svg'
import { ActionSheet } from '../../../../components/actionSheet'
import { Empty } from '../../../empty'
import { AnalysisItem } from '../index'
import workStyles from '../workItem.module.less'
export function Analysis(props) {
  const { data, actionsEvent, setActionsEvent } = props
  const navigate = useNavigate()
  const [visible, setVisible] = useState<boolean>(false)
  const [itemIndex, setItemIndex] = useState<number>(0)
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [shareVisible, setShareVisible] = useState<boolean>(false)
  const [funnelActions, setFunnelActions] = useState<any[]>([
    {
      name: '文件类型',
      children: [
        {
          name: 'Word',
          select: true,
        },
        {
          name: 'Excel',
          select: false,
        },
        {
          name: 'PDF',
          select: false,
        },
      ],
    },
    {
      name: '创建人',
      children: [
        {
          name: '全部',
          select: true,
        },
        {
          name: '我创建的',
          select: false,
        },
        {
          name: '他人创建',
          select: false,
        },
      ],
    },
    {
      name: '排序',
      children: [
        {
          name: '最近打开',
          select: true,
        },
        {
          name: '最近上传',
          select: false,
        },
      ],
    },
  ])
  const actions = useMemo(() => {
    return [
      {
        icon: share1,
        name: '分享',
        event: () => {
          setVisible(false)
          console.log(data[itemIndex])
          setShareVisible(true)
        },
      },
      {
        icon: jurisdiction,
        name: '权限管理',
        event: () => {
          navigate('/news/permission')
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
        icon: edit,
        name: '重命名',
        event: () => {
          setVisible(false)
          setValue(data[itemIndex].name)
          setVisibleDialog(true)
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
  }, [data, itemIndex])

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
      <div>
        {data.map((item, index) => {
          return (
            <AnalysisItem
              item={item}
              index={index}
              key={index}
              getIndex={(i) => {
                setVisible(true)
                setItemIndex(i)
              }}
            />
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
        title={<AnalysisItem item={data[itemIndex]} isHide index={999} />}
      />
      {/* 重命名 */}
      <Dialog
        visible={visibleDialog}
        content={
          <div className={workStyles.diaInput}>
            <Input
              placeholder="请输入名字"
              value={value}
              onChange={(v) => {
                setValue(v)
              }}
            />
          </div>
        }
        title={
          <div
            style={{
              color: '#999',
              fontSize: '14px',
              fontWeight: 'normal',
              textAlign: 'left',
            }}
          >
            重命名
          </div>
        }
        onAction={({ key }) => {
          setVisibleDialog(false)
          key === 'confirm' && (data[itemIndex].name = value)
        }}
        actions={[
          [
            {
              key: 'cancel',
              text: '取消',
            },
            {
              key: 'confirm',
              text: '确定',
            },
          ],
        ]}
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
      {/* 筛选 */}

      <ActionSheet
        visible={actionsEvent === 'funnel'}
        mainBox={
          <div className={workStyles.actionSheetFunnel}>
            {funnelActions.map((item, index) => {
              return (
                <div className={workStyles.actionSheetFunnelBox} key={index}>
                  <div className={workStyles.actionSheetFunnelTitle}>
                    {item.name}
                  </div>
                  <div className={workStyles.actionSheetFunnelList}>
                    {item.children.map((child, c) => {
                      return (
                        <div
                          className={`${workStyles.actionSheetFunnelListItem} ${
                            child.select &&
                            workStyles.actionSheetFunnelListItemSelect
                          }`}
                          onClick={() => {
                            funnelActions[index].children[c].select =
                              !funnelActions[index].children[c].select
                            setFunnelActions([...funnelActions])
                          }}
                          key={c}
                        >
                          {child.name}
                          {child.select && <img src={select} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        }
        getVisible={(v) => {
          //关闭
          setActionsEvent('')
        }}
        unclose
        uncancel
        title={
          <div className={workStyles.actionSheetFunnelTitleBox}>
            <div
              className={workStyles.actionSheetFunnelClose}
              onClick={() => {
                setActionsEvent('')
              }}
            />
            筛选和排序
            <div
              className={workStyles.rest}
              onClick={() => {
                const list = funnelActions.map((item) => {
                  const list = item.children.map((child, i) => ({
                    ...child,
                    select: i === 0,
                  }))
                  return {
                    ...item,
                    children: list,
                  }
                })
                console.log(list)
                setFunnelActions([...list])
              }}
            >
              重置
            </div>
          </div>
        }
      />
    </>
  )
}
