import { useState, useEffect, useMemo } from 'react'
import { Picker, WaterMark, Collapse } from 'antd-mobile'
import styles from './index.module.less'
import specificScenarios from './specificScenarios.svg'
import { useNavigate } from 'react-router-dom'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useRequest } from '../../hooks/useRequest'
export function SpecificScenarios() {
  const { user } = useCurrentApp()
  const { userInfo, token } = user
  const { realname, username } = userInfo.userInfo

  const [data, setData] = useState([])
  // 初始选中状态
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState<(string | null)[]>()
  const [list, setList] = useState()
  useEffect(() => {
    getDataFirst()
  }, [])

  // 获取数据
  const requestDate = useRequest('/scenedetail/sceneDetail/queryTreeList')
  async function getDataFirst() {
    const res = await requestDate(null, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'X-Access-Token': token,
      },
    })
    setData(res.treeList)
    setValue(Array(res.treeList[0].slotTitle))
  }

  const basicColumns = useMemo(() => {
    const arr = []
    if (data) {
      if (data[0]) {
        arr[0] = data.map((item, index) => {
          return {
            label: item.slotTitle,
            value: item.slotTitle,
          }
        })
      }
      return arr
    }
    return [[]]
  }, [data])
  const navigate = useNavigate()
  useEffect(() => {}, [])
  function handleClick(url) {
    navigate(url)
  }
  // 水印
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
  const [props, setProps] = useState<{ [key: string]: any }>(textProps)
  // 获取列表展示数据的索引值
  const getIndex = useMemo(() => {
    let num
    if (data && value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].slotTitle === value[0]) {
          num = i
        }
      }
      return num
    }

    return 0
  }, [value])

  function dataList(data) {
    if (data[getIndex] != undefined) {
      return data[getIndex].children.map((item) => {
        return (
          <Collapse.Panel key={item.slotTitle} title={item.slotTitle}>
            {item.children
              ? item.children.map((items, i) => {
                  console.log(items)
                  return (
                    <li
                      key={i}
                      onClick={() =>
                        handleClick(`/problemFeedback?type=${items.slotTitle}`)
                      }
                    >
                      {items.slotTitle}
                    </li>
                  )
                })
              : ''}
          </Collapse.Panel>
        )
      })
    }
  }
  return (
    <>
      <p
        className={styles.titleSelect}
        onClick={() => {
          setVisible(true)
        }}
      >
        {value}
        <img src={specificScenarios} />
      </p>

      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onConfirm={(v) => {
          setValue(v)
        }}
      ></Picker>

      {/* 二级展示 */}

      <Collapse accordion className={styles.outBox}>
        {data[0] && dataList(data)}
      </Collapse>
      <WaterMark {...props} />
    </>
  )
}
