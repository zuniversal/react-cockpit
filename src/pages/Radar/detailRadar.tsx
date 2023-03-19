import React from 'react'
import style from './detailRadar.module.less'
export default function DetailRadar() {
  return (
    <div className={style.cropping}>
      <iframe className={style.box} src="/" height="50px"></iframe>
    </div>
  )
}
