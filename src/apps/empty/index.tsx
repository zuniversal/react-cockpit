import noData from '../../assets/icons/no-data.svg'
// import notifyEmptyImg from '../../assets/notify/notifyEmptyImg.svg'
export function Empty(props) {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: (props.marginTop || 170) + 'px',
        paddingTop: +(props.paddingTop || 0) + 'px',
        paddingBottom: +(props.paddingBottom || 0) + 'px',
      }}
    >
      <img
        src={props.src || noData}
        style={{ width: props.width + 'px' }}
        alt="抱歉，图片加载失败，请检查网络连接或者重新加载图片。"
      />
      <p style={{ fontSize: '10px', color: '#999', ...props.textStyle }}>
        {props.children}
      </p>
    </div>
  )
}
