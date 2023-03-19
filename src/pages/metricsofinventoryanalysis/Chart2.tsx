import { Column } from '@ant-design/plots'
import { useMemo, useState } from 'react'

import { Pagination } from '../../components/pagination'

export function Chart2(props) {
  const { data, height, pageSize = 5 } = props

  const [page, setPage] = useState(1)

  const total = useMemo(() => {
    if (pageSize > 0) {
      return Math.ceil(data.length / pageSize)
    }
    return 0
  }, [pageSize, data])

  const pageData = useMemo(() => {
    if (pageSize > 0) {
      const start = (page - 1) * pageSize
      return data.slice(start, start + pageSize)
    }
    return data
  }, [data, pageSize, page])

  const config2 = {
    data: pageData,
    height,
    isStack: true,
    xField: 'year',
    yField: 'value',
    padding: 'auto',
    appendPadding: [0, 0, 20, 0],
    xAxis: {
      label: {
        autoHide: false,
        style: {
          fontSize: 10,
        },
        formatter(val: string) {
          // if (val.length > 3) {
          //   const idx = val.length / 3
          //   const idxInt = Math.trunc(val.length / 3)
          //   let str = ''
          //   for (let i = 0; i < idxInt; i++) {
          //     if (i === 0) {
          //       str += val.slice(0, 3) + '\n'
          //     } else {
          //       str += val.slice(i * 3, i * 3 + 3) + '\n'
          //     }
          //   }
          //   if (idx !== idxInt) {
          //     str += val.slice(idxInt * 3)
          //   }
          //   return str
          // }
          return val
        },
      },
    },
    color: [
      '#6E94F2',
      '#5FCABB',
      '#707E9D',
      '#5D6C8F',
      '#766BF5',
      '#A098F9',
      '#E39F39',
      '#EEC78D',
    ],
    yAxis: {
      nice: true,
      tickCount: 5,
      // tickInterval: 0.5,
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
    seriesField: 'type',
    legend: false,
    tooltip: {
      domStyles: {
        'g2-tooltip-name': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
        'g2-tooltip-value': {
          fontFamily: 'DIN',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
        'g2-tooltip-title': {
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          fontSize: 13,
          color: '#56555C',
        },
      },
    },
    columnBackground: {
      style: {
        fill: 'rgba(0,0,0,0.1)',
      },
    },
  }

  return (
    <>
      <Column {...config2} />
      {pageSize > 0 && data.length > pageSize && (
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Pagination current={page} onChange={setPage} total={total} />
        </div>
      )}
    </>
  )
}
