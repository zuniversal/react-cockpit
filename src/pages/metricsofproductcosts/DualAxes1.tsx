import { DualAxes } from '@ant-design/plots'
import { Card, Button, Picker } from 'antd-mobile'
import { DownOutline } from 'antd-mobile-icons'
import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'

import { Loading } from '../../components/loading/Loading'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import style from './CardMode.module.less'

import styles1 from './index.module.less'
export const ProductCostDualAxes1 = (props) => {
  const { ProductCostTrendData, type1, segmentKey, value } = props
  let pre = ''
  // const height = 0.65 * document.body.clientWidth
  const height = 245
  const { navigateToDetail } = useCurrentApp()
  // 柱状图数据
  const uvData = useMemo(() => {
    const temp = []
    if (ProductCostTrendData) {
      // 报价成本
      if (segmentKey === '1') {
        // 本体
        if (type1 === 'a') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
        // 交付
        else if (type1 === 'b') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostStandard,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.unitTotalCost,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostStandard,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        }
      }
      // 实际成本
      else if (segmentKey == '2') {
        if (type1 === 'a') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {
            //console.log(error)
          }
        } else if (type1 === 'b') {
          try {
            ProductCostTrendData.map((item) => {
              temp.push({
                time: item.eachMonth,
                type: '单位材料成本',
                value: item.unitMaterialCostActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位全成本',
                value: item.costActual,
              })
              temp.push({
                time: item.eachMonth,
                type: '单位制造付现成本',
                value: item.unitManufacturingCostActual,
              })
            })
          } catch (error) {}
        }
      }
    }
    return temp
  }, [ProductCostTrendData, segmentKey, type1])
  // 折线图数据
  const transformData = useMemo(() => {
    const temp = []
    if (ProductCostTrendData) {
      if (type1 === 'a') {
        try {
          ProductCostTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              name: '市场售价',
              price: item.marketPrice,
            })
            temp.push({
              time: item.eachMonth,
              name: '公司售价',
              price: item.companySellingPrice,
            })
          })
        } catch (error) {
          //console.log(error)
        }
      } else if (type1 === 'b') {
        try {
          ProductCostTrendData.map((item) => {
            temp.push({
              time: item.eachMonth,
              name: '市场售价',
              price: item.marketPrice,
            })
            temp.push({
              time: item.eachMonth,
              name: '公司售价',
              price: item.companySellingPrice,
            })
          })
        } catch (error) {
          //console.log(error)
        }
      }
    }
    return temp
  }, [ProductCostTrendData, type1])

  const config = {
    data: [uvData, transformData],
    padding: 'auto',
    autoFix: true,
    height,
    xField: 'time',
    yField: ['value', 'price'],
    xAxis: {
      label: {
        autoHide: false,
        formatter(val: string) {
          let str = ''
          if (pre === val.split('-')[0]) {
            str = val.split('-')[1]
          } else {
            str = val.split('-')[0].slice(2) + '.' + val.split('-')[1]
          }
          pre = val.split('-')[0]
          return str
        },
      },
    },
    yAxis: {
      value: {
        min: 0,
        nice: true,
        tickCount: 4,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
      price: {
        min: 0,
        nice: true,
        tickCount: 4,
        label: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(217, 217, 217, 0.5)',
              lineDash: [4, 5],
            },
          },
        },
      },
    },
    legend: false,
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.1,
        color: ['#5183FD', '#5FCABB', '#A3A6FF'],
      },
      {
        geometry: 'line',
        seriesField: 'name',
        smooth: true,
        color: ['#E08142', '#766BF5'],
        lineStyle: {
          lineWidth: 2,
        },
        point: { shape: '', size: 2.5 },
        tooltip: {
          formatter: (datum) => {
            return { name: datum.name, value: datum.price }
          },
        },
      },
    ],
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
        },
      },
    ],
  }

  return (
    <>
      <DualAxes {...config} />
    </>
  )
}
