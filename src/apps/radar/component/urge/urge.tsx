import React from 'react'

import { head } from '../../importFile'
import style1 from './urge.module.less'
export function Urge(props) {
  const buttonStyle = {
    width: (props.boxWidth / 260) * 327 + 'px',
    fontSize: props.size + 'em',
    position: 'absolute',
    bottom: '-' + props.boxWidth / 12 + 'px',
    left: 0,
    right: 0,
    margin: 'auto',
    outline: 'none',
    height: props.boxWidth / 5.65 + 'px',
  }
  return (
    <div
      className={`${style1.urge} raderBg`}
      style={{ height: props.boxWidth + 'px' }}
    >
      <div style={{ height: props.boxWidth + 'px', width: '100%' }}>
        <img src={head} style={{ height: props.boxWidth + 'px' }} />
      </div>

      <button
        style={buttonStyle}
        onClick={() => {
          const arr = [[true, true], [true], [true], [true], [true], [true]]
          props.propsState('1')
          props.propsHair(arr)
          localStorage.setItem('hair', JSON.stringify(arr))
          localStorage.setItem('state', '1')
        }}
      >
        {props.state === '1' ? (
          <span style={{ color: '#999999' }}> 催办中</span>
        ) : (
          <span> 一键催办</span>
        )}
      </button>
    </div>
  )
}
