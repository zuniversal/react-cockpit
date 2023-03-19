import { Pie } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import { Popover } from 'antd-mobile'
import { memo } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { removeNegativeData } from '../../utils'

const Pie1 = memo(Pie, () => {
  return true
})

export function CardPie({ isGWH, customHtmlData1, data1, onCallBack }: any) {
  const customHtmlData = customHtmlData1 || { content: [], title: {} }
  const data = data1.sort(function (a, b) {
    return b.ouputQty - a.ouputQty //按实际产能降序排序
  })
  const customHtmlDataItems = customHtmlData.content.map((item, index) => {
    return (
      <div
        key={index}
        style={{
          fontSize: 10,
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'rgba(9, 17, 26, 0.6)' }}>{item.type}</span>&nbsp;
        <span
          style={{
            color: '#09111A',
            fontFamily: 'DIN Alternate',
            fontWeight: 500,
          }}
        >
          {item.value}
        </span>
      </div>
    )
  })

  const color = [
    '#6E94F2',
    '#5FCABB',
    '#707E9D',
    '#5D6C8F',
    '#766BF5',
    '#A098F9',
    '#E39F39',
    '#E4B36A',
    '#EEC78D',
    '#D0DCFA',
  ]

  const windowWidth = useWindowWidth()
  const { navigateToDetail } = useCurrentApp()

  const config = {
    data: removeNegativeData({
      data,
      angleField: isGWH ? 'ouputQtyWh' : 'ouputQty',
      colorField: 'entity',
    }),
    angleField: isGWH ? 'ouputQtyWh' : 'ouputQty',
    colorField: 'entity',
    color,
    padding: [0, 0, 0, 0],
    appendPadding: 0,
    radius: 1,
    innerRadius: 0.8,
    label: false,
    legend: false,
    autoFit: true,
    height: 185,
    tooltip: false,
    statistic: {
      title: false,
      content: {
        //往饼图中心文字传参示例
        customHtml: (container, view, datum, data) => {
          return (
            <div
              onClick={() => {
                navigateToDetail({ unitMode: isGWH ? 'Gwh' : '千支' })
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
                {customHtmlData.title.type}
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
                {customHtmlData.title.value}
              </div>
              {customHtmlDataItems}
            </div>
          )
        },
      },
    },
  }
  let totalValue = 0
  removeNegativeData({
    data,
    angleField: isGWH ? 'ouputQtyWh' : 'ouputQty',
    colorField: 'entity',
  }).map((item) => {
    if (isGWH) {
      if (item.ouputQtyWh > 0) {
        totalValue += item.ouputQtyWh
      }
    } else {
      if (item.ouputQty > 0) {
        totalValue += item.ouputQty
      }
    }
  })
  return (
    <div style={{ display: 'flex', position: 'relative', zIndex: 103 }}>
      <Pie1
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
          {removeNegativeData({
            data,
            angleField: isGWH ? 'ouputQtyWh' : 'ouputQty',
            colorField: 'entity',
          }).map((item, index) => {
            let percent = 0
            if (isGWH) {
              if (!isNaN(item.ouputQtyWh)) {
                percent =
                  item.ouputQtyWh >= 0
                    ? ((item.ouputQtyWh / totalValue) * 100).toFixed(2)
                    : -1
              }
            } else {
              if (!isNaN(item.ouputQty)) {
                percent =
                  item.ouputQty >= 0
                    ? ((item.ouputQty / totalValue) * 100).toFixed(2)
                    : -1
              }
            }
            let ratio = 0
            if (isGWH) {
              if (!isNaN(item.ouputQtyWh) && !isNaN(item.planQtyWh)) {
                ratio = item.ouputQtyWh / item.planQtyWh
                item['ratio'] = (ratio * 100).toFixed(2) + '%'
              }
            } else {
              if (!isNaN(item.ouputQty) && !isNaN(item.planQty)) {
                ratio = item.ouputQty / item.planQty
                item['ratio'] = (ratio * 100).toFixed(2) + '%'
              }
            }

            return (
              <Popover
                key={index}
                content={
                  <div style={{ minWidth: 140 }}>
                    <div style={{ textAlign: 'right' }}>{item.entity}</div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '6px 0',
                        alignItems: 'center',
                      }}
                    >
                      <span>达成率</span>
                      <span>{item.ratio}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <span>实际产能</span>
                      <span>{isGWH ? item.ouputQtyWh : item.ouputQty}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <span>计划产能</span>
                      <span>{isGWH ? item.planQtyWh : item.planQty}</span>
                    </div>
                  </div>
                }
                placement="left"
                mode="dark"
                trigger="click"
                onVisibleChange={(visible) => {
                  onCallBack(visible, item.entity)
                }}
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
                      {item.entity}
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
