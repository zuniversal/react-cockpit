import { Pie } from '@ant-design/plots'
import { Popover } from 'antd-mobile'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { removeNegativeData } from '../../utils'
import top from './top.svg'
export const Cost = (props) => {
  const { navigateToDetail } = useCurrentApp()
  const height = 160
  const data = [
    {
      type: '薪资成本',
      value: 1000,
    },
    {
      type: '福利费用',
      value: 1000,
    },
    {
        type: '其他费用',
        value: 500,
      },
  ]
  const data1 = ['30%','25%','25%']
  const color = ['#6E94F2', '#5FCABB','#707E9D']
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
            <div style={{height:'90px',paddingTop:'30px'}} 
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
                人工总成本
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
                5000
                <div  style={{
                    marginTop:'6px',
                  fontSize: 12,
                  fontFamily: 'PingFang SC',
                  fontWeight: 500,
                  color: '#09111A',
                  marginBottom: 5,
                  }}>环比<span style={{color:'#F1965C'}}>+15%</span><img src={top} alt="" />
                </div>
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
        onReady={(plot) => {
          plot.on('plot:click', () => {
            navigateToDetail({})
          });
        }}
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
            return (
              <Popover
                key={index}
                content={
                  <div
                    style={{ minWidth: 140 }}
                  >
                    <div>
                      {item.type}
                      <span
                        style={{ float: 'right' }}
                      >{item.value}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '6px 0',
                        alignItems: 'center',
                      }}
                    >
                   
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
                    {data1[index]}
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
