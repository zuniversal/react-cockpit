/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2023-01-11 20:45:24
 * @LastEditors: Teemor
 */

import { SafeArea } from 'antd-mobile'

import info from '../../assets/news/info.svg'
import styles from './index.module.less'
export function Example(props) {
  return (
    <div className={styles.example}>
      <div className={styles.exampleBox}>
        <img src={info} /> 当前页面为样例数据，正式页面正在开发中
      </div>
      <SafeArea position="bottom" />
    </div>
  )
}
