import React, { useMemo } from 'react'

import astronaut from '../../assets/version/astronaut.svg'
import cloud from '../../assets/version/cloud.svg'
import comet from '../../assets/version/comet.svg'
import earth from '../../assets/version/earth.svg'
import logo from '../../assets/version/logo.svg'
import moon from '../../assets/version/moon.svg'
import satelite from '../../assets/version/satelite.svg'
import styles from './VersionUpdate.module.less'
function UpdateCard(props) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h1>更新通知</h1>
        <span>{props.versionNum}</span>
      </div>
      <div className={styles.con}>
        <h2>新版本抢先体验</h2>
        <div dangerouslySetInnerHTML={{ __html: props.content }} />
      </div>
      <button
        className={styles.experienceBtn}
        onClick={props.handleUpdateClick}
      >
        立即体验
      </button>
    </div>
  )
}

export function VersionUpdate(props) {
  const height = window.screen.height
  function handleUpdateClick() {
    props.experience(false)
  }
  return (
    <div className={styles.version} style={{ height }}>
      <div className={styles.card}>
        <div className={styles.img}>
          <img className={styles.logo} src={logo} alt="" />
          <img className={styles.astronaut} src={astronaut} alt="" />
          <img className={styles.satelite} src={satelite} alt="" />

          <img className={styles.moon} src={moon} alt="" />
          <img className={styles.earth} src={earth} alt="" />
          <div className={styles.cloud} />
          {/* <img className={styles.cloud} src={cloud} alt="" /> */}
          <img className={styles.comet} src={comet} alt="" />
        </div>
        <UpdateCard
          versionNum={props.versionData.version}
          content={props.versionData.msgContent}
          handleUpdateClick={handleUpdateClick}
        />
      </div>
    </div>
  )
}
