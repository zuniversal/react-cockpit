import { CascadePickerView, SafeArea } from 'antd-mobile'
import moment from 'moment'
import { useMemo, useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
/**
 * 年月日选择器
 */
export function DatePicker(props) {
  const { visible, onClose, onChange, value, dateType } = props
  const NewY = moment(new Date()).format('YYYY')
  const NewM = moment(new Date()).format('MM')
  const NewD = moment(new Date()).format('DD')
  const currenM = moment(value).format('YYYY')
  const currenD = moment(value).format('YYYY')
  const date = [NewY]
  const [value1, setValue] = useState<(string | null)[]>(date)
  //默认值
  useEffect(() => {
    if (dateType === 'a') {
      date.push(currenM)
      date.push(currenD)
    } else {
      date.push(currenM)
    }
    setValue(date)
  }, [dateType])
  useEffect(() => {
    let scrollTop = 0
    const modalvisible = () => {
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      sessionStorage.setItem('homeScrollTop', String(scrollTop))
      document.body.className = 'bodyNoScro11'
      document.body.style.top = -scrollTop + 'px'
    }
    // 弹窗隐藏谓用，还原body的滚动条
    const modalHidden = () => {
      document.body.className = ''
      document.body.style.top = '0'
      scrollTop = Number(sessionStorage.getItem('homeScrollTop') || 0)
      window.scrollBy(0, scrollTop)
    }
    if (visible) {
      modalvisible()
    } else {
      modalHidden()
    }
  }, [visible])
  const days = (y) => {
    return moment(y, 'YYYY-MM').daysInMonth()
  }
  //获取月份和日
  const months = (year = null) => {
    const month = []
    const isCurry = Number(year) === Number(NewY)
    let m = 1
    while (m <= (isCurry ? Number(NewM) : 12)) {
      const day = []
      const item = { label: m + '月', value: (m < 10 ? '0' : '') + m }
      if (dateType === 'a') {
        let num = 1
        while (
          num <=
          (isCurry && Number(NewM) === m
            ? Number(NewD)
            : days(`${year}-${m < 10 ? '0' : ''}${m}`))
        ) {
          day.push({ label: num + '日', value: (num < 10 ? '0' : '') + num })
          num++
        }
        item.children = day
      }
      month.push(item)
      m++
    }
    return month
  }
  const options = useMemo(() => {
    const date = []
    for (let i = 10; i >= 0; i--) {
      const year = Number(NewY) - i
      const item = { label: year + '年', value: String(year), children: [] }
      item.children = months(year)
      date.push(item)
    }
    return date
  }, [dateType])
  useEffect(() => {
    const date = moment(value).format('YYYY-MM-DD').split('-')
    setValue(date)
  }, [value])
  //改变默认值
  const changeDateFun = (val = []) => {
    const arr = [...val]
    const isCurry = Number(arr[0]) === Number(NewY)
    if (arr[0] !== value1[0]) {
      arr[1] = isCurry ? NewM : '12'
      arr[2] =
        isCurry && arr[1] === NewM ? NewD : String(days(arr[0] + '-' + arr[1]))
    } else {
      arr[1] !== value1[1] &&
        (arr[2] =
          isCurry && arr[1] === NewM
            ? NewD
            : String(days(arr[0] + '-' + arr[1])))
    }
    setValue(arr)
  }
  return ReactDOM.createPortal(
    <div>
      {visible && (
        <div
          style={{
            position: 'fixed',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            zIndex: '999',
          }}
        >
          <div
            onClick={() => {
              onClose(false)
            }}
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              right: '0',
              bottom: '0',
              zIndex: '998',
              background: 'rgba(0,0,0,.7)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '100%',
              left: '0',
              bottom: '0',
              background: '#fff',
              borderRadius: '8px 8px 0 0',
              zIndex: '999',
            }}
          >
            <div
              style={{
                lineHeight: '40px',
                display: 'flex',
                padding: '0 20px',
                color: '#1677ff',
                justifyContent: 'space-between',
                borderBottom: '1px solid #eee',
              }}
            >
              <div
                onClick={() => {
                  onClose(false)
                }}
              >
                取消
              </div>
              <div
                style={{
                  color: '#333',
                }}
              >
                日期选择
              </div>
              <div
                onClick={() => {
                  let date = ''
                  value1.forEach((item, i) => {
                    date += `${i !== 0 ? '-' : ''}${item}`
                  })
                  onChange(new Date(date))
                  onClose(false)
                }}
              >
                确定
              </div>
            </div>
            <CascadePickerView
              options={options}
              value={value1}
              onChange={(val) => {
                changeDateFun(val)
              }}
            />
            <SafeArea position="bottom" />
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
