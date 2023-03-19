/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2022-12-15 08:57:39
 * @LastEditors: Teemor
 */
import { SafeArea, ActionSheet } from 'antd-mobile'
import type { Action } from 'antd-mobile/es/components/action-sheet'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../../assets/news/logo.svg'
import right from '../../../assets/news/right.svg'
import { Example } from '../../../components/example'
import { HeadTitle } from '../../../components/helmet'
import { WorkItem } from '../Components'
import styles from './index.module.less'
export default function Permission() {
  const navigator = useNavigate()
  const [visible, setVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('所有岗位可见')
  const actions: Action[] = [
    { text: '所有岗位可见', key: 'copy' },
    { text: '部分岗位可见', key: 'edit' },
    { text: '取消', key: 'cancel' },
  ]
  const workItemList = [
    {
      name: '计划物流中心',
      children: [
        {
          name: '计划管理部',
          children: [
            {
              name: '主计划组负责人',
              active: false,
            },
            {
              name: '主计划组协助负责人',
              active: false,
            },
          ],
        },
        {
          name: '厦门计划物流部',
          children: [
            {
              name: '计划部负责人',
              active: false,
            },
          ],
        },
      ],
    },
    {
      name: '厦门制造运营中心',
      children: [
        {
          name: 'XMA1工厂',
          children: [
            {
              name: 'XMA1工厂负责人',
              active: false,
            },
          ],
        },
      ],
    },
  ]
  return (
    <div className={styles.permission}>
      <HeadTitle>权限管理</HeadTitle>
      <div className={styles.title}>公开范围</div>
      <div
        className={styles.permissionItem}
        onClick={() => {
          setVisible(true)
        }}
      >
        {title}
        <img src={right} />
      </div>
      <div className={styles.title} style={{ marginTop: '8px' }}>
        岗位列表
      </div>
      <div className={styles.permissionMain}>
        <div className={styles.permissionMainItem}>
          <div className={styles.mainItemTitle}>
            <div className={styles.mainItemTitleLeft}>
              <img src={logo} />
              <div>
                张三
                <p>XXXXX岗位</p>
              </div>
            </div>
            所有者
          </div>
          <WorkItem data={workItemList} />
        </div>
      </div>

      <ActionSheet
        visible={visible}
        actions={actions}
        safeArea
        closeOnAction
        onAction={(e) => {
          console.log(e)
          e.key !== 'cancel' && setTitle(e.text)
          setVisible(false)
        }}
      />
      <div
        className={styles.fixedBottom}
        onClick={() => {
          navigator('/news/addPermission')
        }}
      >
        <div className={styles.fixedBottomItem}>添加岗位</div>
        <SafeArea position="bottom" />
      </div>
      <Example />
    </div>
  )
}
