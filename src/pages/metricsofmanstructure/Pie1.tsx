import { Column } from '@ant-design/plots'
import React, { useState, useEffect } from 'react'

export const DemoDualAxes1 = (props) => {
  const [data, setData] = useState([
    {
      name: '电池技术研究院',
      value: 40,
      type: '2022届',
    },
    {
      name: '电池技术研究院',
      value: 60,
      type: '2021届',
    },
    {
      name: '电池技术研究院',
      value: 80,
      type: '2020届',
    },
    {
      name: '电池技术研究院',
      value: 250,
      type: '2019届',
    },

    {
      name: '制造工程研究院',
      value: 220,
      type: '2019届',
    },
    {
      name: '制造工程研究院',
      value: 80,
      type: '2020届',
    },
    {
      name: '制造工程研究院',
      value: 50,
      type: '2021届',
    },
    {
      name: '制造工程研究院',
      value: 40,
      type: '2022届',
    },

    {
      name: '四川材料制造运营中心',
      value: 190,
      type: '2019届',
    },
    {
      name: '四川材料制造运营中心',
      value: 50,
      type: '2020届',
    },
    {
      name: '四川材料制造运营中心',
      value: 50,
      type: '2021届',
    },
    {
      name: '四川材料制造运营中心',
      value: 30,
      type: '2022届',
    },
    {
      name: '江苏制造运营中心',
      value: 160,
      type: '2019届',
    },
    {
      name: '江苏制造运营中心',
      value: 50,
      type: '2020届',
    },
    {
      name: '江苏制造运营中心',
      value: 50,
      type: '2021届',
    },
    {
      name: '江苏制造运营中心',
      value: 30,
      type: '2022届',
    },
    {
      name: '合肥制造运营中心',
      value: 150,
      type: '2019届',
    },
    {
      name: '合肥制造运营中心',
      value: 50,
      type: '2020届',
    },
    {
      name: '合肥制造运营中心',
      value: 50,
      type: '2021届',
    },
    {
      name: '合肥制造运营中心',
      value: 30,
      type: '2022届',
    },
  ])
  const config = {
    data,
    isStack: true,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    fontSize: '10',
    height: 260,
    color: ['#5D6C8F', '#707E9D', '#5FCABB', '#6E94F2'],
    // tooltip: false,
    intervalPadding: 10,
    padding: [50, 0, 40, 32],
    yAxis: {
      nice: true,
      max: 600,
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
          },
        },
      },
    },
    xAxis: {
      label: {
        // layout: 'center',
        formatter: (val) => {
          if (val.length > 5) {
            return val.substring(0, 5) + '\n' + val.substring(5)
          } else {
            return val
          }
        },
        style: {
          fontSize: 10,
          padding: -100,
        },
      },
      style: {
        fontSize: 10,
        fontWeight: 300,
        textAlign: 'left',
        textBaseline: 'middle',
        shadowColor: 'white',
        shadowBlur: 10,
      },
    },
    legend: false,
    columnBackground: {
      style: {
        fill: 'rgba(0,0,0,0.1)',
      },
    },

    minColumnWidth: 17,
    maxColumnWidth: 17,
  }

  return (
    <div style={{ position: 'relative' }}>
      <p
        style={{
          position: 'absolute',
          top: '20px',
          fontSize: '9px',
          color: '#969696',
        }}
      >
        (人数)
      </p>
      <Column {...config} />
    </div>
  )
}
