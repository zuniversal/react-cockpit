/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2022-12-15 08:57:39
 * @LastEditors: Teemor
 */
import { SafeArea, SearchBar } from 'antd-mobile'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Example } from '../../../components/example'
import { HeadTitle } from '../../../components/helmet'
import { WorkItem } from '../Components'
import styles from './index.module.less'
export default function AddPermission() {
  const navigator = useNavigate()

  const workItemList = [
    {
      name: '计划物流中心',
      children: [
        {
          name: '计划管理部',
          children: [
            {
              name: '主计划组负责人',
              active: true,
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
            {
              name: '电芯生产部负责人',
              active: false,
            },
            {
              name: '质量保障部负责人',
              active: false,
            },
            {
              name: '计划IE室负责人',
              active: false,
            },
          ],
        },
        {
          name: 'XMA2工厂',
          children: [
            {
              name: 'XMA2工厂负责人',
              active: false,
            },
            {
              name: '电芯生产部负责人',
              active: false,
            },
            {
              name: '质量保障部负责人',
              active: false,
            },
            {
              name: '计划IE室负责人',
              active: false,
            },
          ],
        },
        {
          name: 'XMA3工厂',
          children: [
            {
              name: 'XMA3工厂负责人',
              active: false,
            },
            {
              name: '电芯生产部负责人',
              active: false,
            },
            {
              name: '质量保障部负责人',
              active: false,
            },
            {
              name: '计划IE室负责人',
              active: false,
            },
          ],
        },
        {
          name: 'XMA4工厂',
          children: [
            {
              name: 'XMA4工厂负责人',
              active: false,
            },
            {
              name: '电芯生产部负责人',
              active: false,
            },
            {
              name: '质量保障部负责人',
              active: false,
            },
            {
              name: '计划IE室负责人',
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
      <div className={styles.permissionMainItem}>
        <SearchBar placeholder="请输入内容" />
        <WorkItem data={workItemList} isSelect />
      </div>
      <div className={styles.fixedBottom}>
        <div
          className={styles.fixedBottomItem}
          onClick={() => {
            navigator('/news/permission')
          }}
        >
          确定
        </div>
        <SafeArea position="bottom" />
      </div>
      <Example />
    </div>
  )
}
