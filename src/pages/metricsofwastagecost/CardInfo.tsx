import styles from './index.module.less'
export const CardInfo = (props) => {
  const infoData = props.infoData
  const colorArr = props.colorConfig
  const setCardName = props.setCardName
  const CardName = props.CardName
  return (
    <>
      <div className={styles.itemList}>
        {infoData.map((item, index) => {
          return (
            <div
              key={item.category}
              className={styles.colItem}
              onClick={() => {
                if (CardName === item.category) {
                  setCardName('')
                } else {
                  setCardName(item.category)
                }
              }}
            >
              <div className={styles.itemBox}>
                <span
                  className={styles.circle}
                  style={{ background: colorArr[index] }}
                />
                {item.category}
              </div>
              <div
                className={styles.text}
                style={{ color: '#587AE3', fontFamily: 'DIN', fontSize: 10 }}
              >
                {item.materialPrice}元/kwh
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
