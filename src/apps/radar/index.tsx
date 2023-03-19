import { HeadTitle } from '../../components/helmet'
import { Example } from '../../components/example'
import { useState, useEffect, useMemo } from 'react'
import { Urge } from './component/urge/urge'
import { IndexControl } from './component/indexControl/indexControl'
import { Eject } from './component/eject/eject'

export default function RadarApp() {
  const [boxWidth, setBoxWidth] = useState(260)
  const [dial, setDial] = useState([]) //点击催办的位置
  const [hair, setHair] = useState(JSON.parse(localStorage.getItem('hair'))) //所有催办的状态
  const [state, setState] = useState(localStorage.getItem('state'))
  const [size, setSize] = useState(1)
  const [imgShow, setImgShow] = useState(false) // 更改加载图片显示状态
  // 更改加载图片显示状态
  useMemo(() => {
    if (state === '1') {
      setTimeout(() => {
        setImgShow(true)
        setState('0')
        localStorage.setItem('state', '0')
      }, 3000)
    }
  }, [state])

  useEffect(() => {
    // 初始化催办状态
    if (localStorage.getItem('hair') === null) {
      localStorage.setItem(
        'hair',
        JSON.stringify([
          [false, false],
          [false],
          [false],
          [false],
          [false],
          [false],
        ])
      )
    }
    // 初始化一键催办状态
    if (localStorage.getItem('state') === null) {
      localStorage.setItem('state', '0')
    }
  }, [state])

  // 显示催办详细弹出层
  const [ejectData, setEjectData] = useState(Array) //数据
  const [visible, setVisible] = useState(false)
  const showPanel = (item) => {
    setEjectData(item)
  }
  const stateExhibition = (bool) => {
    setVisible(bool)
  }
  const propsState = (str) => {
    setState(str)
  }
  const propsHair = (arr) => {
    setHair(arr)
  }
  const propsBoxWidth = (num) => {
    setBoxWidth(num)
  }
  const propsSize = (num) => {
    setSize(num)
  }
  const propsDial = (arr) => {
    setDial(arr)
  }
  //获取每一项催办个数
  let num: number
  function getState() {
    let arr = []
    if (hair) {
      hair.map((item) => {
        num = 0
        item.map((i) => {
          if (i) {
            num++
          }
        })
        if (num === item.length) {
          arr.push('已催办')
        } else if (item.length !== 1) {
          arr.push(`催办${num}/${item.length}`)
        } else {
          arr.push('')
        }
      })
    }
    return arr
  }
  return (
    <div>
      <HeadTitle>雷达</HeadTitle>
      <div style={{ position: 'relative', zIndex: '0' }}>
        {/* 顶部一键催办 */}
        <Urge
          boxWidth={boxWidth}
          size={size}
          state={state}
          propsState={propsState}
          propsHair={propsHair}
        />
        {/* 指标预控 */}
        <IndexControl
          state={state}
          imgShow={imgShow}
          getState={getState}
          hair={hair}
          propsBoxWidth={propsBoxWidth}
          propsSize={propsSize}
          showPanel={showPanel}
          stateExhibition={stateExhibition}
          propsDial={propsDial}
        />
        {/* 弹出层催办详细 */}
        <Eject
          ejectData={ejectData}
          visible={visible}
          dial={dial}
          propsHair={propsHair}
          closeExhibition={stateExhibition}
        />
      </div>
      <Example />
    </div>
  )
}
