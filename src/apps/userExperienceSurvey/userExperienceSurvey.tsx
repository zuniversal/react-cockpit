import { Radio, WaterMark, Button, Toast, Input } from 'antd-mobile'
import moment from 'moment'
import React, { useState, useEffect, useMemo } from 'react'

import userExperienceSurvey from '../../assets/userExperienceSurvey/userExperienceSurvey.svg'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint, sendPagePoint } from '../../utils/index'
import styles from './userExperienceSurvey.module.less'
export function UserExperienceSurvey() {
  // 水印
  const { user, indicator } = useCurrentApp()
  const { userInfo, token } = user
  const { realname, username } = userInfo.userInfo
  const textProps = {
    content: `${realname} ${username.substring(
      username.length - 4,
      username.length
    )}`,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  }
  const [props, setProps] = useState(textProps)
  const url = '/researchIssues/getIssuesAnswer'
  const [isFlag, setIsFlag] = useState(false) // 提交按钮做防重复点击
  useEffect(() => {
    getData()
  }, [])

  // 页面埋点
  const { chooseDate, dateType } = user
  const requestEnd = useRequest(
    '/datapageaccesslog/dataPageAccessLog/updateEndTime'
  )
  const indicatorUpdateTime = indicator?.updateTime
  const formattedChooseDate = useMemo(() => {
    let date = chooseDate
    if (indicatorUpdateTime) {
      const indicatorUpdateDate = new Date(indicatorUpdateTime)

      if (`${indicatorUpdateDate}` !== 'Invalid Date') {
        if (date.getTime() > indicatorUpdateDate.getTime()) {
          date = indicatorUpdateDate
        }
      }
    }
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return `${y}-${m}-${d}`
  }, [chooseDate, indicatorUpdateTime])
  useEffect(() => {
    console.log('进入用户反馈调研页面')
    let id
    async function fn() {
      const { result } = await sendPagePoint({
        pageName: '用户反馈调研',
        requestParam: JSON.stringify({
          chooseDate: formattedChooseDate,
          dateType,
        }),
        accessDepth: 'level2',
        requestUrlReal: window.location.pathname,
        requestUrl: '/userExperienceSurvey',
      })
      id = result
    }
    fn()
    return () => {
      requestEnd({
        ID: id,
      })
      console.log('退出用户反馈调研页面')
    }
  }, [])

  // 获取问题
  const [list, setList] = useState([])
  const requestDate = useRequest(url)
  async function getData() {
    const res = await requestDate(null, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'X-Access-Token': token,
      },
    })
    setList(res)
  }
  // 判定一级答案
  const [value, setValue] = useState('')
  let radio
  const [problem1, setProblem1] = useState('')
  // 判定二级答案
  let arr = []
  let checkbox
  const [problem2, setProblem2] = useState('')
  // 判定三级答案
  const [text, setText] = useState('')
  const [problem3, setProblem3] = useState('')
  // 初始展示提交按钮（根据按钮切换显示隐藏）
  const [state, setState] = useState(true)
  // 打分数据展示（满意与否）
  const [state1, setState1] = useState(Boolean)
  // 是否提交成功
  const [submitOn, setSubmitOn] = useState(false)
  // 分支进入不同的答案渲染
  function submit(index) {
    radio = index + 1
    setProblem1(list[0].issuesId)
    if (index === 1 || index === 2 || index === 0) {
      setProblem2(list[1].issuesId)
      setProblem3(list[2].issuesId)
      setState(false)
      setState1(true)
    } else {
      setProblem2(list[3].issuesId)
      setProblem3(list[4].issuesId)
      setState(false)
      setState1(false)
    }
  }

  // 提交答案
  async function submitAnswers() {
    fetch('api/answer/userAnswer/userAnswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json ',
        'X-Access-Token': token,
        platform: 'ckpt',
      },
      body: JSON.stringify([
        {
          answerId: value,
          issuesId: problem1,
        },
        {
          answerId: arr.join(','),
          issuesId: problem2,
        },
        {
          answer: text,
          issuesId: problem3,
        },
      ]),
    }).then((data) => {
      setIsFlag(false)
      data.json().then((data) => {
        if (data.code === 200) {
          setSubmitOn(true)
        } else {
          Toast.show({
            content: data.message,
            position: 'top',
          })
        }
      })
    })
  }

  // 判定是否可提交
  function submitAnswer() {
    checkbox = document.querySelectorAll('input[type=checkbox]')
    arr = []
    checkbox.forEach((e) => {
      if (e.checked) {
        arr.push(e.getAttribute('data-idCard'))
      }
    })
    if (arr.length === 0) {
      Toast.show({
        content: '选项内容不能为空',
        position: 'top',
      })
    } else {
      if (!isFlag) {
        setIsFlag(true)
        submitAnswers()
      } else {
        Toast.show({
          content: '请勿重复提交',
        })
      }
    }
  }
  return (
    <>
      {submitOn ? (
        <Success />
      ) : (
        list.length !== 0 && (
          <div>
            <div className={styles.outBox}>
              <h1 className={styles.title}>用户体验调研</h1>
              {/* 一级问卷调查打分 */}
              <div>
                <div
                  className={styles.smallTitle}
                  dangerouslySetInnerHTML={{
                    __html: list.length && list[0].issuesName,
                  }}
                />
                <div>
                  <Radio.Group>
                    {list.length &&
                      list[0].answerVOList.map((item, index) => {
                        return (
                          <div className={styles.contexts} key={index}>
                            {' '}
                            <Radio
                              value={JSON.stringify(item.answerSortNo)}
                              onChange={() => {
                                setValue(item.answerId)
                                submit(index)
                              }}
                            >
                              <p>{item.answerName.replace(/<[^>]+>/g, '')}</p>
                            </Radio>
                          </div>
                        )
                      })}
                  </Radio.Group>
                </div>
              </div>
              {/* 切换状态 */}
              {!state &&
                (state1 ? (
                  <div>
                    {/* 二级问卷调查 */}
                    <div>
                      <div
                        className={styles.smallTitle}
                        dangerouslySetInnerHTML={{
                          __html: list.length && list[1].issuesName,
                        }}
                      />
                      <div>
                        <Radio.Group>
                          {list.length &&
                            list[1].answerVOList.map((item, index) => {
                              return (
                                <div className={styles.contexts} key={index}>
                                  <p>
                                    <input
                                      type="checkbox"
                                      name="box"
                                      data-idcard={item.answerId}
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        marginRight: '8px',
                                      }}
                                    />
                                    {item.answerName.replace(/<[^>]+>/g, '')}
                                  </p>
                                </div>
                              )
                            })}
                        </Radio.Group>
                      </div>
                    </div>
                    {/* 三级问卷调查 */}
                    <div className={styles.btn_bottomMargin}>
                      <div
                        className={styles.smallTitle}
                        dangerouslySetInnerHTML={{
                          __html: list.length && list[2].issuesName,
                        }}
                      />
                      <Input
                        value={text}
                        onChange={(val) => {
                          setText(val)
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* 二级问卷调查 */}
                    <div>
                      <div
                        className={styles.smallTitle}
                        dangerouslySetInnerHTML={{
                          __html: list.length && list[3].issuesName,
                        }}
                      />
                      <div>
                        <Radio.Group>
                          {list.length &&
                            list[3].answerVOList.map((item, index) => {
                              return (
                                <div className={styles.contexts} key={index}>
                                  <p>
                                    <input
                                      type="checkbox"
                                      data-idcard={item.answerId}
                                      name="box"
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        marginRight: '8px',
                                      }}
                                    />
                                    {item.answerName.replace(/<[^>]+>/g, '')}
                                  </p>
                                </div>
                              )
                            })}
                        </Radio.Group>
                      </div>
                    </div>
                    {/* 三级问卷调查 */}
                    <div className={styles.btn_bottomMargin}>
                      <div
                        className={styles.smallTitle}
                        dangerouslySetInnerHTML={{
                          __html: list.length && list[4].issuesName,
                        }}
                      />
                      <Input
                        value={text}
                        onChange={(val) => {
                          setText(val)
                        }}
                      />
                    </div>
                  </div>
                ))}

              {/* 提交答案按钮 */}
              <Button
                block
                type="submit"
                color="primary"
                style={{
                  fontSize: '14px',
                  position: 'relative',
                  zIndex: '103',
                }}
                onClick={() => {
                  submitAnswer()
                }}
              >
                提交
              </Button>
            </div>
          </div>
        )
      )}
      <WaterMark {...props} />
    </>
  )
}
// 成功页
function Success() {
  const { user } = useCurrentApp()
  const { userInfo, token } = user
  const height = document.documentElement.clientHeight
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: height + 'px',
        backgroundColor: '#F5F5F5',
        padding: '46px 12px ',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          height: '219px',
          textAlign: 'center',
          backgroundColor: '#fff',
          paddingTop: '24px',
        }}
      >
        <img src={userExperienceSurvey} />
        <p style={{ fontSize: '12px', color: '#000', marginTop: '-5pxs' }}>
          您的答卷已经提交，感谢您的参与！
        </p>
      </div>
      <Button
        block
        type="submit"
        color="primary"
        style={{ fontSize: '14px', height: '40px', marginTop: '64px' }}
        onClick={() => {
          history.go(-1)
        }}
      >
        返回
      </Button>
    </div>
  )
}
