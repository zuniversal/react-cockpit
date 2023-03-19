import { DualAxes, G2 } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'

export const InventoryDualAxes = (props: any) => {
  const windowWidth = useWindowWidth()
  // 接取props中图例数据
  const columnData = props.columnData
  const lineData = props.lineData
  const { chooseName, setChooseName } = props

  return (
    <DualAxes
      {...{
        data: [columnData, lineData],
        autoFix: true,
        height: windowWidth * 0.6,
        // padding: [17, 17, 17, 17],
        xField: 'company',
        yField: ['value', 'value1'],
        xAxis: {
          label: {
            autoHide: false,
            formatter: function (val: string) {
              let idx = -1
              if (val.length > 5) {
                if (val.indexOf('（') !== -1) {
                  idx = val.indexOf('（')
                  return val.slice(0, idx) + '\n' + val.slice(idx)
                } else {
                  if (/^[a-zA-Z]+$/.test(val)) {
                    if (val.length > 7) {
                      idx = Math.trunc(val.length / 2)
                      return val.slice(0, idx) + '\n' + val.slice(idx)
                    } else {
                      return val
                    }
                  } else {
                    idx = Math.trunc(val.length / 2)
                    return val.slice(0, idx) + '\n' + val.slice(idx)
                  }
                }
              }
              return val
            },
          },
        },
        yAxis: {
          value: {
            nice: true,
            min: 0,
            tickInterval: props.tab === 'Gwh' ? 10 : 1000,
            grid: {
              line: {
                style: {
                  stroke: 'rgba(217, 217, 217, 0.5)',
                  lineDash: [4, 5],
                },
              },
            },
          },
          value1: {
            nice: true,
            min: 0,
            tickInterval: 100,
          },
        },
        tooltip: {
          showTitle: true,
          title: 'company',
          formatter: (datum) => {
            if (datum.name) {
              return { name: datum.name, value: datum.value, display: 'block' }
            } else {
              return { name: datum.name, value: datum.value, display: 'none' }
            }
          },
          containerTpl: `
          <div class="g2-tooltip">
            <!-- 标题容器，会自己填充 -->
            <div class="g2-tooltip-title"></div>
            <!-- 列表容器，会自己填充 -->
            <ul class="g2-tooltip-list"></ul>
          </div>
        `,
          itemTpl: `
          <ul class="g2-tooltip-list">
            <li class="g2-tooltip-list-item" style="display:{display}">
              <span class="g2-tooltip-marker" style="background-color: {color}"></span>
              <span class="g2-tooltip-name">{name}</span>
              <span class="g2-tooltip-value">{value}</span>
            </li>
          </ul>
        `,
          domStyles: {
            'g2-tooltip-name': {
              fontFamily: 'PingFang SC',
              fontWeight: 400,
              fontSize: 10,
            },
            'g2-tooltip-title': {
              fontFamily: 'PingFang SC',
              fontWeight: 500,
              fontSize: 10,
            },
          },
        },
        legend: {
          position: 'bottom',
          itemName: {
            style: (item, index, items) => {
              if (index == 2) {
                items.pop()
              }
            },
          },
        },
        interactions: [
          {
            type: 'element-selected',
            cfg: {
              start: [
                {
                  trigger: 'element:click',
                  action(evt) {},
                },
              ],
              end: [
                {
                  trigger: 'element:click',
                  action(evt) {
                    if (!evt.event.data) {
                      return
                    }
                    const company = evt.event.data.data.company
                    if (company === chooseName) {
                      setChooseName('')
                    } else {
                      setChooseName(company)
                    }
                  },
                },
              ],
            },
          },
        ],
        geometryOptions: [
          {
            geometry: 'column',
            isGroup: true,
            dodgePadding: 1,
            seriesField: 'name',
          },
          {
            geometry: 'line',
            lineStyle: {
              stroke: '#5FCABB',
              lineWidth: 0,
            },
          },
        ],
      }}
    />
  )
}
