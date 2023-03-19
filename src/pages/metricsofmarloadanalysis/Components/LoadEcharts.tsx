import { useState } from 'react'

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'
import styles from './LoadEcharts.module.less'
export function LoadEcharts(props) {
  const { navigateToDetail, user } = useCurrentApp()
  const [index, setIndex] = useState(null)
  const [indexData, setIndexData] = useState(null)
  const data = [
    {
      name: '产能',
      belong: ['基地', 'XMA1', 'XMA2', 'XMA3'],
      value: [7, 2, 14, 3],
    },
    {
      name: '客户需求',
      belong: ['基地', 'XMA1', 'XMA2', 'XMA3'],
      value: [17, 8, 3, 20],
    },

    {
      name: '差异',
      belong: ['基地', 'XMA1', 'XMA2', 'XMA3'],
      value: [10, 6, 11, 17],
    },
  ]
  const array = []
  data.map((item) => {
    array.push(...item.value)
  })
  // 最大值
  const max = (Math.max.apply(null, array) / 4 + 1) * 5
  const itemW = ~~(max / 4)
  let vertical = [
    max,
    itemW * 3,
    itemW * 2,
    itemW,
    0,
    itemW,
    itemW * 2,
    itemW * 3,
    max,
  ]
  // mock
  vertical = [20, 15, 10, 5, 0, 5, 10, 15, 20]
  const [first] = data
  const calculationW = (i): number => {
    return (data[0].value[i] / max) * 100
  }
  const toDetail = (data) => {
    index === data.index
      ? navigateToDetail({ factoryName: data.factoryName })
      : setIndex(data.index)
  }
  const isLeft = (i) => {
    return data[0].value[i] < data[1].value[i]
  }
  const setIndexDataFun = (i) => {
    setIndexData(indexData === i ? null : i)
  }
  return (
    <>
      <div className={styles.loadCharts}>
        <div className={styles.yName}>
          {first.belong.map((item) => {
            return <div key={item}>{item}</div>
          })}
        </div>
        <div className={styles.loadChartsMain}>
          <div className={styles.horizontal}>
            {first.value.map((item, i) => {
              return (
                <div key={i} className={styles.box}>
                  <div
                    className={styles.left}
                    onClick={(e) => {
                      toDetail({ index: i, factoryName: first.belong[i] })
                    }}
                  >
                    <div
                      className={`${indexData === 0 && styles.gray}`}
                      style={{
                        width: calculationW(i) + '%',
                      }}
                    />
                    {isLeft(i) && (
                      <div
                        className={`${indexData === 2 && styles.gray} ${
                          styles.difference
                        }`}
                        style={{
                          width: (data[2].value[i] / max) * 100 + '%',
                        }}
                      />
                    )}
                  </div>
                  <div
                    className={styles.right}
                    onClick={(e) => {
                      toDetail({ index: null, factoryName: first.belong[i] })
                    }}
                  >
                    <div
                      className={`${indexData === 1 && styles.gray}`}
                      style={{
                        width: (data[1].value[i] / max) * 100 + '%',
                      }}
                    />
                    {!isLeft(i) && (
                      <div
                        className={`${styles.difference} ${
                          indexData === 2 && styles.gray
                        }`}
                        style={{
                          width: (data[2].value[i] / max) * 100 + '%',
                        }}
                      />
                    )}
                  </div>
                  {index === i && (
                    <div
                      className={styles.tooltip}
                      onClick={(e) => {
                        toDetail({ index: null, factoryName: first.belong[i] })
                      }}
                    >
                      <div className={styles.title}>{first.belong[i]}</div>
                      <div className={styles.toolTipBox}>
                        <div className={styles.toolTipItem}>
                          <div>
                            <span /> 产能:
                          </div>
                          {data[0].value[i]}
                        </div>
                        <div className={styles.toolTipItem}>
                          <div>
                            <span /> 客户需求:
                          </div>
                          {data[1].value[i]}
                        </div>
                        <div className={styles.toolTipItem}>
                          <div>
                            <span /> 差异:
                          </div>
                          {data[2].value[i]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: -26,
                top: 10,
                color: '#999',
                fontSize: 9,
              }}
            >
              (Gwh)
            </div>
            <div className={styles.vertical}>
              {vertical.map((item) => {
                return (
                  <div
                    key={item}
                    style={{ position: 'relative', paddingTop: 12 }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 140,
                        borderWidth: 0,
                        borderLeftWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: '#D9D9D980',
                        position: 'absolute',
                        bottom: 14,
                        left: '50%',
                      }}
                    />
                    {/* <div className={styles.before} /> */}
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.legend}>
            {data.map((item, i) => {
              return (
                <div
                  key={item.name}
                  className={styles.legendItem}
                  onClick={() => {
                    setIndexDataFun(i)
                  }}
                >
                  <div
                    className={`${i === indexData && styles.gray} ${
                      styles.legendIcon
                    }`}
                  />
                  {item.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
