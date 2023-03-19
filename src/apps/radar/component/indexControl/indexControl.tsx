import { Button, FloatingPanel, List, Grid } from 'antd-mobile'
import React, { useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { bottom, loding } from '../../importFile'
import data from './data.mock'
import style1 from './indexControl.module.less'

export function IndexControl(props) {
  const anchors = [window.innerHeight - 345, window.innerHeight - 70]
  const myRef = useRef()
  const navigate = useNavigate()
  // 获取浮动面板延申的高度
  function getHeight() {
    const panel = document.querySelector('.adm-floating-panel')
    if (
      panel.getBoundingClientRect().top >
      (document.body.offsetHeight / 100) * 10
    ) {
      const multiple = panel.getBoundingClientRect().top / 295
      props.propsBoxWidth(260 * multiple)
      props.propsSize(multiple)
      document.querySelector('.raderBg').style.opacity = multiple
    }
    if (
      panel.getBoundingClientRect().top <=
      (document.body.offsetHeight / 100) * 10
    ) {
      document.querySelector('.raderBg').style.opacity = 0
    }
  }
  // 点击↓图标切换展示内容
  const [i, setI] = useState(-1)
  function showContent(icon, index) {
    myRef.current.setHeight(window.innerHeight - 70)
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
  // 跳转路由
  function handleOnPage(url) {
    navigate(url)
  }
  return (
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
                    <h4 className={style1.title}>{item.title} </h4>
                    <div className={style1.h4ButtomDiv}>
                      <span> {item.subtitle}</span>
                      {/* 一键催办展示 */}
                      {props.state === '1' ? (
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
                            {props.imgShow ? (
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
                      {props.state === '0' ? (
                        <span
                          style={{
                            marginRight: '50px',
                            color: '#5EC6BF',
                          }}
                        >
                          {props.getState()[index]}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </Grid.Item>
                  <Grid.Item span={1} className={style1.iconWrapper}>
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
                        // return
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
                                <Grid.Item span={1} />
                                <Grid.Item span={21}>
                                  <h4 className={style1.smallTitle}>
                                    {item1.title}
                                  </h4>
                                  {props.hair &&
                                    props.hair[index] &&
                                    props.hair[index][leng] && (
                                      <div className={style1.urgeShow}>
                                        已催办
                                      </div>
                                    )}
                                </Grid.Item>
                                <Grid.Item
                                  span={2}
                                  onClick={() => {
                                    localStorage.setItem(
                                      'metricId',
                                      `${item.frontComponent.slice(9)}`
                                    )

                                    handleOnPage(
                                      `/?id=${item.frontComponent.slice(
                                        9
                                      )}&type=${
                                        item.type
                                      }&homeShowState=0&title=${item.title}`
                                    )
                                    console.log(item.frontComponent)
                                  }}
                                >
                                  <img
                                    src={bottom}
                                    style={{
                                      transform: 'rotate(270deg)',
                                      marginTop: '20px',
                                    }}
                                  />
                                </Grid.Item>
                                <Grid.Item span={1} />
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
                                      props.stateExhibition(true)
                                      props.showPanel(item1)
                                      props.propsDial([leng, index])
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
  )
}
