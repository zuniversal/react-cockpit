import { Line } from '@ant-design/plots'
import { useWindowWidth } from '@react-hook/window-size'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
export const LosscostLine = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    asyncFetch()
  }, [])

  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json'
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error)
      })
  }
  const windowWidth = useWindowWidth()
  const height = windowWidth * 0.55
  const config = {
    data,
    padding: 'auto',
    xField: 'Date',
    yField: 'scales',
    height,
    smooth: true,
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: 'rgba(217, 217, 217, 0.5)',
            lineDash: [4, 5],
          },
        },
      },
    },
  }

  return <Line {...config} />
}
