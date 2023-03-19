/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2022-12-15 08:57:39
 * @LastEditors: Teemor
 */
// import { useNavigate } from 'react-router-dom'

import banner from '../../assets/news/banner.svg'
import { HeadTitle } from '../../components/helmet'
import { CardMode } from './Components'
import {Example} from '../../components/example'
export default function News() {
  //   const navigator = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'#fff'}}>
      <HeadTitle>资讯</HeadTitle>
      <div>
        <div style={{ padding: '8px 0';background:'#f5f5f5'}}>
          <img src={banner} style={{ width: '100%' }} />
        </div>
        <CardMode />
      </div>
      <Example />
    </div>
  )
}
