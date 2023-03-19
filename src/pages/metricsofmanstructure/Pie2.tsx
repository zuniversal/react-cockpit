import { Column } from '@ant-design/plots'
import React, { useRef, useState, useEffect } from 'react'

import { Pagination } from '../../components/pagination'
import styles from './CardMode.module.less'

export const DemoDualAxes = (props) => {
  const [pageNo, setPageNo] = useState(1)
  const [pages, setPages] = useState(1)
  const [title, setTitle] = useState('')
  const plotRef = useRef<any>()
  const data = [
    {
      dept: '一级部门',
      num: 2800,
      type: '当前在职人数',
    },
    {
      dept: '部门2',
      num: '2500',
      type: '当前在职人数',
    },
    {
      dept: '部门3',
      num: '2000',
      type: '当前在职人数',
    },
    {
      dept: '部门4',
      num: '1800',
      type: '当前在职人数',
    },
    {
      dept: '部门5',
      num: '1500',
      type: '当前在职人数',
    },
    {
      dept: '部门6',
      num: '800',
      type: '当前在职人数',
    },
  ]

  const config = {
    data,
    xField: 'dept',
    yField: 'num',
    height: 260,
    seriesField: 'type',
    padding: [50, 16, 20, 40],
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fontSize: 10,
          padding: -100,
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    legend: false,
  }

  useEffect(() => {
    plotRef.current.setState('inactive', (item) => {
      if (title === '') {
        return false
      }
      return item.dept !== title
    })
  }, [title])

  return (
    <div style={{ position: 'relative' }}>
      <p
        style={{
          position: 'absolute',
          top: '15px',
          fontSize: '10px',
          color: '#8C8C8C',
        }}
      >
        (人数)
      </p>
      <Column
        {...config}
        onReady={(plot) => {
          plotRef.current = plot
          plot.on('plot:click', (evt) => {
            const { x, y } = evt
            const { xField } = plot.options
            const tooltipData = plot.chart.getTooltipItems({ x, y })
            setTitle(tooltipData[0].title)
            props.getChildTitle(tooltipData[0].title)
          })
        }}
      />
      <div className={styles.legendList}>
        <div>
          <span />
          当前在职人数
        </div>
      </div>
      <Pagination total={pages} current={pageNo} onChange={setPageNo} />
    </div>
  )
}
