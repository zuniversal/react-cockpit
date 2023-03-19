import { useState, useRef, useEffect, useMemo } from 'react'
import { Button, FloatingPanel, List, Grid, Popup } from 'antd-mobile'
import { useNavigate } from 'umi'
import style1 from './index.module.less'

import {
  stock,
  production,
  sale,
  resources,
  plan,
  sales,
  head,
  bottom,
  userImg,
  telPhone,
  icon,
  loding,
} from './importFile'
export default function Radar() {
  let data = [
    {
      url: stock,
      title: '库存',
      subtitle: '1项告警   1项预警',
      children: [
        {
          title: '库存分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
        {
          title: '库存分析',
          warning: {
            //预警
            type: 1,
            reason: '超过预警值2Gwh',
            time: '2022.12.27 10:23',
            state: false,
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
    {
      url: production,
      title: '生产',
      subtitle: '1项告警',
      children: [
        {
          title: '生产分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
    {
      url: sale,
      title: '销售',
      subtitle: '1项告警',
      children: [
        {
          title: '销售分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
    {
      url: resources,
      title: '人力',
      subtitle: '1项告警',
      children: [
        {
          title: '人力分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
    {
      url: plan,
      title: '计划',
      subtitle: '1项告警',
      children: [
        {
          title: '计划分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
    {
      url: sales,
      title: '售后',
      subtitle: '1项告警',
      children: [
        {
          title: '售后分析',
          warning: {
            //告警
            type: 0,
            reason: '超过告警值10Gwh',
            time: '2022.12.27 10:23',
            state: false,
            router: '/',
          },
          children: [
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
            {
              company: '某某某某岗',
              picture: userImg,
              name: '张三',
              phone: '1234567890',
            },
          ],
        },
      ],
    },
  ]
  const [boxWidth, setBoxWidth] = useState(260)
  const anchors = [window.innerHeight - 345, window.innerHeight - 70]
  const myRef = useRef()
  const [visible, setVisible] = useState(false)
  const [dataDetail, setDataDetail] = useState() //拉取催办数据
  const [dial, setDial] = useState([]) //点击催办的位置
  const [hair, setHair] = useState(JSON.parse(localStorage.getItem('hair'))) //所有催办的状态
  const [state, setState] = useState(localStorage.getItem('state'))
  const navigate = useNavigate()
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
  // 隐藏顶部催办数据列表置顶(待优化)
  function setHeight() {
    myRef.current.setHeight(window.innerHeight - 70)
  }
  // 获取浮动面板延申的高度
  function getHeight() {
    const panel = document.querySelector('.adm-floating-panel')
    if (
      panel.getBoundingClientRect().top >
      (document.body.offsetHeight / 100) * 10
    ) {
      const multiple = panel.getBoundingClientRect().top / 295
      setBoxWidth(260 * multiple)
      setSize(multiple)
      document.querySelector('.urge___CHQCO').style.opacity = multiple
    }
    if (
      panel.getBoundingClientRect().top <=
      (document.body.offsetHeight / 100) * 10
    ) {
      document.querySelector('.urge___CHQCO').style.opacity = 0
    }
  }
  // 点击↓图标切换展示内容
  const [i, setI] = useState(-1)
  function showContent(icon, index) {
    setHeight()
    // 还原图标
    if (icon.target.style.transform === 'rotate(180deg)') {
      icon.target.style.transform = 'rotate(0deg)'
      setI(-1)
    } else {
      document.querySelectorAll('.rotateImg').forEach((item) => {
        item.style.transform = 'rotate(0deg)'
      })
      icon.target.style.transform = 'rotate(180deg)'
      setI(index)
    }
  }

  // 显示催办详细弹出层
  function showPanel(item) {
    setDataDetail(item)
    setVisible(true)
  }
  // 跳转路由
  function handleOnPage(url) {
    navigate(url)
  }
  //获取每一项催办个数
  let num
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
    <div style={{ position: 'relative', zIndex: '0' }}>
      {/* 顶部一键催办 */}
      <div className={style1.urge} style={{ height: boxWidth + 'px' }}>
        <div style={{ height: boxWidth + 'px', width: '100%' }}>
          <img src={head} style={{ height: boxWidth + 'px' }} />
        </div>

        <button
          style={{
            width: (boxWidth / 260) * 327 + 'px',
            fontSize: size + 'em',
            position: 'absolute',
            bottom: '-' + boxWidth / 12 + 'px',
            left: 0,
            right: 0,
            margin: 'auto',
            outline: 'none',
            height: boxWidth / 5.65 + 'px',
          }}
          onClick={() => {
            const arr = [[true, true], [true], [true], [true], [true], [true]]
            setState('1')
            setHair(arr)
            localStorage.setItem('hair', JSON.stringify(arr))
            localStorage.setItem('state', '1')
          }}
        >
          {state === '1' ? (
            <span style={{ color: '#999999' }}> 催办中</span>
          ) : (
            <span> 一键催办</span>
          )}
        </button>
      </div>

      {/* 指标预控 */}
      <div className={style1.panel}>
        <FloatingPanel anchors={anchors} ref={myRef} onHeightChange={getHeight}>
          <List>
            {data.map((item, index) => {
              return (
                <List.Item key={index}>
                  <Grid columns={24} gap={0}>
                    <Grid.Item span={3}>
                      <img src={item.url} />
                    </Grid.Item>
                    <Grid.Item span={20}>
                      <h4
                        style={{
                          margin: 0,
                          paddingLeft: '8px',
                          fontSize: '14px',
                        }}
                      >
                        {item.title}
                      </h4>
                      <div
                        style={{
                          paddingLeft: '8px',
                          color: '#999999',
                          fontSize: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span> {item.subtitle}</span>
                        {/* 一键催办展示 */}
                        {state === '1' ? (
                          index === 1 || index === 0 ? (
                            <span
                              style={{
                                marginRight: '50px',
                                color: '#5EC6BF',
                              }}
                            >
                              已催办
                            </span>
                          ) : (
                            <span
                              style={{
                                marginRight: '50px',
                                color: '#5EC6BF',
                              }}
                            >
                              {imgShow ? (
                                '已催办'
                              ) : (
                                <img src={loding} className={style1.rotate} />
                              )}
                            </span>
                          )
                        ) : (
                          ''
                        )}
                        {/* 单独催办展示 */}
                        {state === '0' ? (
                          <span
                            style={{
                              marginRight: '50px',
                              color: '#5EC6BF',
                            }}
                          >
                            {getState()[index]}
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </Grid.Item>

                    <Grid.Item span={1}>
                      <img
                        src={bottom}
                        className="rotateImg"
                        style={{
                          position: 'relative',
                          top: '1vh',
                          bottom: 0,
                          margin: 'auto',
                        }}
                        onClick={($event) => {
                          showContent($event, index)
                        }}
                      />
                    </Grid.Item>
                    {/* 点击图标后展示内容区域 */}
                    {i === index
                      ? item.children &&
                        item.children.map((item1, leng) => {
                          return (
                            <Grid.Item span={24} key={leng}>
                              <div className={style1.content}>
                                <Grid columns={24} gap={0}>
                                  <Grid.Item span={1}></Grid.Item>
                                  <Grid.Item span={21}>
                                    <h4
                                      style={{
                                        position: 'relative',
                                        fontSize: 14,
                                        margin: '12px 0',
                                        color: '#333',
                                        height: '20px',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {item1.title}
                                    </h4>
                                    {hair &&
                                      hair[index] &&
                                      hair[index][leng] && (
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: 100,
                                            marginTop: '-34px',
                                            borderRadius: '4px',
                                            width: '46px',
                                            height: '20px',
                                            lineHeight: '20px',
                                            fontSize: '10px',
                                            color: '#fff',
                                            background: '#5EC6BF',
                                            textAlign: 'center',
                                          }}
                                        >
                                          已催办
                                        </div>
                                      )}
                                  </Grid.Item>
                                  <Grid.Item span={2}>
                                    <img
                                      src={bottom}
                                      style={{
                                        transform: 'rotate(270deg)',
                                        marginTop: '20px',
                                      }}
                                      onClick={() =>
                                        // handleOnPage('/radar/detailRadar')
                                        handleOnPage('/')
                                      }
                                    />
                                  </Grid.Item>
                                  <Grid.Item span={1}></Grid.Item>
                                  <Grid.Item span={18}>
                                    <div>
                                      {item1.warning.type ? (
                                        <p
                                          style={{
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '4px',
                                            color: '#E8954F',
                                          }}
                                        >
                                          告警原因：{item1.warning.reason}
                                        </p>
                                      ) : (
                                        <p
                                          style={{
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '4px',
                                            color: '#FF7979',
                                          }}
                                        >
                                          告警原因：{item1.warning.reason}
                                        </p>
                                      )}
                                      <p
                                        style={{
                                          fontSize: '12px',
                                          margin: 0,
                                          color: '#999999',
                                        }}
                                      >
                                        告警时间：{item1.warning.time}
                                      </p>
                                    </div>
                                  </Grid.Item>
                                  <Grid.Item span={5}>
                                    <Button
                                      fill="solid"
                                      size="small"
                                      onClick={() => {
                                        showPanel(item1)
                                        setDial([leng, index])
                                      }}
                                    >
                                      催办
                                    </Button>
                                  </Grid.Item>
                                </Grid>
                              </div>
                            </Grid.Item>
                          )
                        })
                      : ''}
                  </Grid>
                </List.Item>
              )
            })}
          </List>
        </FloatingPanel>
      </div>
      {/* 弹出层催办详细 */}
      <Popup
        visible={visible}
        showCloseButton
        onClose={() => {
          setVisible(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '500px',
        }}
      >
        <div className={style1.popup}>
          <h2>库存分析</h2>
          <h4 style={{ margin: 0, marginBottom: '12px' }}>
            一级部门名称 - 二级部门名称 - 三级部门名称
          </h4>
          <div style={{ height: '280px', overflow: 'auto' }}>
            {dataDetail &&
              dataDetail.children.map((item, index) => {
                return (
                  <div key={index}>
                    <h6
                      style={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: '#999999',
                      }}
                    >
                      {item.company}
                    </h6>
                    <div className={style1.outBox}>
                      {/* 左侧 */}
                      <div className={style1.leftBox}>
                        <img src={item.picture} alt="" />
                        <span>{item.name}</span>
                      </div>
                      {/* 中间 */}
                      <div className={style1.centerBox}>
                        <img src={telPhone} />
                        <span>{item.phone}</span>
                      </div>
                      {/* 右侧 */}
                      <div className={style1.rightBox}>
                        <Button size="small">拨打</Button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          {/* 底部催办按钮 */}
          <div className={style1.bottomBox}>
            <div>
              <img src={icon} alt="" />
              <span>催办信息将以短信与经营驾驶舱消息通知进行提醒</span>
            </div>
            <div>
              <Button
                block
                onClick={() => {
                  let arr = JSON.parse(localStorage.getItem('hair'))
                  arr[dial[1]][dial[0]] = true
                  setHair(arr)
                  localStorage.setItem('hair', JSON.stringify(arr))
                  setVisible(false)
                }}
              >
                确定催办
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}
