import { Pie } from '@ant-design/plots'
import { Popover } from 'antd-mobile'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { removeNegativeData } from '../../utils'
export const Cost = (props) => {
  console.log(props)
  const { navigateToDetail } = useCurrentApp()
  //获取当前可视区域的高度
  // console.log(document.body.clientWidth)
  // 设置图表容器高度
  // const height = 0.5 * document.body.clientWidth
  const height = 185
  //往饼图中心文字传参示例
  const customHtmlData = props.customHtmlData || { title: {} }
  const { unit = '' } = props
  const data = [
    {
      type: '成品',
      value: 50,
    },
    {
      type: '原材料',
      value: 25,
    },
  ]

  let totalValue = 0
  data.map((item) => {
    if (item.value > 0) {
      totalValue += item.value
    }
  })

  const color = ['#6E94F2', '#5FCABB']
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    color,
    padding: [0, 0, 0, 0],
    appendPadding: 0,
    radius: 1,
    innerRadius: 0.8,
    label: false,
    legend: false,
    autoFit: true,
    height,
    tooltip: false,
    statistic: {
      title: false,
      content: {
        //往饼图中心文字传参示例
        customHtml: (container, view, datum, data) => {
          return (
            <div
              onClick={() => {
                navigateToDetail({ segmentKey: props.segmentKey })
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontFamily: 'PingFang SC',
                  fontWeight: 500,
                  color: '#09111A',
                  marginBottom: 5,
                }}
              >
                {/* {customHtmlData.title.type} */}
                库存总金额
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontFamily: 'DIN Alternate',
                  fontWeight: 600,
                  height: 20,
                  color: '#09111A',
                  marginBottom: 12,
                }}
              >
                {/* {customHtmlData.title.value} */}
                500
              </div>
            </div>
          )
        },
      },
    },
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        zIndex: 103,
        width: '100%',
      }}
    >
      <Pie
        {...config}
        data={removeNegativeData(config)}
        style={{ width: '50%' }}
      />
      <div
        style={{
          width: '45%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 3% 0 8%',
        }}
      >
        <div style={{ width: '100%' }}>
          {data.map((item, index) => {
            const percent =
              item.value >= 0
                ? ((item.value / totalValue) * 100).toFixed(2)
                : -1
            return (
              <Popover
                key={index}
                content={
                  <div style={{ minWidth: 140 }}>
                    <div>{item.type}</div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '6px 0',
                        alignItems: 'center',
                      }}
                    >
                      {item.value}
                      {unit}
                    </div>
                  </div>
                }
                placement="left"
                mode="dark"
                trigger="click"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        marginRight: 9,
                        background: `${color[index]}`,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: 'PingFang SC',
                        color: 'rgba(9, 17, 26, 0.6)',
                      }}
                    >
                      {item.type}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'DIN',
                      color: '#09111A',
                      fontWeight: 600,
                    }}
                  >
                    {percent >= 0 ? `${percent}%` : '<0'}
                  </div>
                </div>
              </Popover>
            )
          })}
        </div>
      </div>
    </div>
  )
}
