import empty from '../../../assets/icons/no.svg'
import { Empty } from '../../empty/index'
import styles from '../index.module.less'

export function DetailContent(props) {
  const decline = require('../../../assets/icons/decline.svg')
  const rise = require('../../../assets/icons/rise.svg')
  const { title, list, marginBottom } = props
  return (
    <div className={styles.productionSection} style={{ marginBottom }}>
      <div className={styles.productionSectionTitle}>
        {title?.map((item, index) => {
          if (!item.unit) {
            return (
              <div key={index} style={{ lineHeight: '36px' }}>
                {item.title}
              </div>
            )
          } else {
            return (
              <div key={index}>
                <div>{item.title}</div>
                <div>{item.unit}</div>
              </div>
            )
          }
        })}
      </div>
      {list.length > 0 ? (
        <>
          {list?.map((item, index) => {
            let icon1 = ''
            let color1 = '#616161'
            if (!['0%', '-', null].includes(item.shjeRate)) {
              if (Number(item.shjeRate) > 0) {
                color1 = '#F1965C'
                icon1 = rise
              } else {
                color1 = '#5FCABB'
                icon1 = decline
              }
            }
            let icon2 = ''
            let color2 = '#616161'
            if (!['0%', '-', null].includes(item.dwshcbRate)) {
              if (Number(item.dwshcbRate) > 0) {
                color2 = '#F1965C'
                icon2 = rise
              } else {
                color2 = '#5FCABB'
                icon2 = decline
              }
            }
            let icon3 = ''
            let color3 = '#616161'
            if (!['0%', '-', null].includes(item.trcclRate)) {
              if (Number(item.trcclRate) > 0) {
                color3 = '#F1965C'
                icon3 = rise
              } else {
                color3 = '#5FCABB'
                icon3 = decline
              }
            }
            return (
              <div className={styles.productionSectionList} key={index}>
                <div className={`${styles.list} ${styles.listTitle}`}>
                  {item.workSection || item.factoryStage}
                  <span />
                </div>
                <div className={styles.list}>
                  <div className={styles.listPrice}>
                    {item.shje}
                    {/* <span>万元</span> */}
                  </div>
                  <div className={styles.listPercent}>
                    <span style={{ color: color1 }}>
                      {item.shjeRate ? `${item.shjeRate}%` : '/'}
                    </span>
                    {item.shjeRate && <img src={icon1} />}
                  </div>
                </div>
                <div className={styles.list}>
                  <div className={styles.listPrice}>
                    {item.dwshcb}
                    {/* <span>元/Kwh</span> */}
                  </div>
                  <div className={styles.listPercent}>
                    <span style={{ color: color2 }}>
                      {item.dwshcbRate ? `${item.dwshcbRate}%` : '/'}
                    </span>
                    {item.dwshcbRate && <img src={icon2} />}
                  </div>
                </div>
                <div className={styles.list}>
                  <div className={styles.listPrice}>
                    {item.trccl}
                    {/* <span>%</span> */}
                  </div>
                  <div className={styles.listPercent}>
                    <span style={{ color: color3 }}>
                      {item.trcclRate ? `${item.trcclRate}%` : '/'}
                    </span>
                    {item.trcclRate && <img src={icon3} />}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <Empty src={empty} marginTop="20" width="32">
          暂无数据
        </Empty>
      )}
    </div>
  )
}
