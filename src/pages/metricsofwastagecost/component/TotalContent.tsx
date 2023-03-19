import empty from '../../../assets/icons/no.svg'
import { Empty } from '../../empty/index'
import styles from '../index.module.less'
export function TotalContent(props) {
  const { topData, nextPage, title, pageTitle } = props
  return (
    <div className={styles.infoBoxBg}>
      <div className={styles.infoTop}>
        <div className={styles.infoTopTitle}>{pageTitle}</div>
        <div
          className={styles.infoTopDetail}
          onClick={() => {
            nextPage()
          }}
        >
          {title}
          <img src={require('../../../assets/icons/costright.svg')} />
        </div>
      </div>
      <div className={styles.infoBox}>
        <div className={styles.info} style={{ marginRight: '4px' }}>
          <div className={styles.infoTitle}>
            <span>总损耗金额</span>
          </div>
          {topData.sumLoss == 0 ? (
            <Empty
              src={empty}
              marginTop="0"
              width="20"
              textStyle={{ margin: 0 }}
            >
              暂无数据
            </Empty>
          ) : (
            <div className={styles.infoContent}>
              <div className={styles.infoCon}>
                <div className={styles.infoConValue}>{topData.sumLoss}</div>
                <div className={styles.infoConTitle}>金额(万元)</div>
              </div>
              <div className={styles.infoCon}>
                <div className={styles.infoConValue}>
                  <span style={{ color: topData.sumLossRateColor }}>
                    {topData.sumLossRate ? `${topData.sumLossRate}%` : `/`}
                  </span>
                  {topData.sumLossRate && <img src={topData.sumLossRateIcon} />}
                </div>
                <div className={styles.infoConTitle}>环比</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.info} style={{ marginLeft: '4px' }}>
          <div className={styles.infoTitle}>
            <span>单位损耗金额</span>
          </div>
          {topData.sumDwLoss == 0 ? (
            <Empty
              src={empty}
              marginTop="0"
              width="20"
              textStyle={{ margin: 0 }}
            >
              暂无数据
            </Empty>
          ) : (
            <div className={styles.infoContent}>
              <div className={styles.infoCon}>
                <div className={styles.infoConValue}>{topData.sumDwLoss}</div>
                <div className={styles.infoConTitle}>金额(元/Kwh)</div>
              </div>
              <div className={styles.infoCon}>
                <div className={styles.infoConValue}>
                  <span style={{ color: topData.sumDwLossRateColor }}>
                    {topData.sumDwLossRate ? `${topData.sumDwLossRate}%` : `/`}
                  </span>
                  {topData.sumDwLossRate && (
                    <img src={topData.sumDwLossRateIcon} />
                  )}
                </div>
                <div className={styles.infoConTitle}>环比</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
