import { useState } from 'react'

import beforeIcon from '../../../assets/icons/beforeIcon.svg'
import empty from '../../../assets/icons/no.svg'
import { SegmentedControls } from '../../../components/tabs/SegmentedControls'
import { Empty } from '../../empty/index'
import { MarketLine } from '../CardLine'
import { Chart1 } from '../Chart1'
import styles from '../index.module.less'
export function TabContent(props) {
  const [segmentKey, setSegmentKey] = useState('0')
  const { data, lineData, colorArr, legendData } = props
  return (
    <>
      <div className={styles.Card}>
        <SegmentedControls
          activeKey={segmentKey}
          onChange={(key) => {
            setSegmentKey(key)
          }}
          tabs={[
            { key: '0', title: '损耗趋势' },
            { key: '1', title: '投入产出率趋势' },
          ]}
        />
      </div>

      {segmentKey === '0' && (
        <>
          {data.length > 0 ? (
            <>
              <p
                style={{ color: '#999', display: 'flex', alignItems: 'center' }}
              >
                <img
                  style={{ width: '16px', marginRight: '5px' }}
                  src={beforeIcon}
                  alt=""
                />
                <span>近6月趋势</span>
              </p>
              <div className={styles.unitFont}>(万元)</div>
              <Chart1 data={data} />
            </>
          ) : (
            <Empty src={empty} marginTop="100">
              暂无数据
            </Empty>
          )}
        </>
      )}

      {segmentKey === '1' && (
        <>
          {legendData.length > 0 ? (
            <>
              <p
                style={{ color: '#999', display: 'flex', alignItems: 'center' }}
              >
                <img
                  style={{ width: '16px', marginRight: '5px' }}
                  src={beforeIcon}
                  alt=""
                />
                <span>近6月趋势</span>
              </p>
              <div className={styles.unitFont}>(%)</div>
              <MarketLine lineData={lineData} colorConfig={colorArr} />
              <div className={styles.lineLegend}>
                {legendData?.map((item, index) => {
                  return (
                    <div key={index} className={styles.lineLegendBox}>
                      <span style={{ background: colorArr[index] }} />
                      {item}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <Empty src={empty} marginTop="100">
              暂无数据
            </Empty>
          )}
        </>
      )}
    </>
  )
}
