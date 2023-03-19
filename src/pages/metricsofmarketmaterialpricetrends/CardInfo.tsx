import styles from './index.module.less';
import decline from '@/assets/icons/decline.svg';
import rise from '@/assets/icons/rise.svg';

export const CardInfo = (props) => {
  const infoData = props.infoData;
  const colorArr = props.colorConfig;
  const setCardName = props.setCardName;
  const CardName = props.CardName;
  return (
    <>
      <p className={styles.titleBox}>
        <span className={styles.bg} />
        <span className={styles.title}>环比数据</span>
      </p>
      <div className={styles.itemList}>
        {infoData.map((item, index) => {
          return (
            <div
              key={item.category}
              className={styles.colItem}
              onClick={() => {
                if (CardName === item.category) {
                  setCardName('');
                } else {
                  setCardName(item.category);
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
                ￥{item.materialPrice}
              </div>
              <div
                className={styles.text}
                style={{
                  fontFamily: 'DIN',
                  fontSize: 10,
                  color:
                    item.value?.indexOf('-') === -1 ? '#D97D43' : '#2AA694',
                }}
              >
                {item.value?.indexOf('-') === -1
                  ? `+ ${item.value} `
                  : `${item.value} `}

                <img src={item.value?.indexOf('-') === -1 ? rise : decline} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
