export const FaultTabs = (props) => {
  const { data } = props
  return (
    <div
      style={{
        background: '#F5F5F5',
        padding: '12px 12px 12px 0',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: '10px 0',
            marginLeft: '12px',
            alignItems: 'center',
            justifyItems: 'center',
            background: '#fff',
            borderRadius: '4px',
          }}
        >
          <div style={{ color: '#333', fontSize: '16px', fontWeight: 700 }}>
            {data.ptdEquipFailTimeTotal}
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            故障停机时长(min)
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            marginLeft: '12px',
            padding: '10px 0',
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center',
            background: '#fff',
            borderRadius: '4px',
          }}
        >
          <div style={{ color: '#333', fontSize: '16px', fontWeight: 700 }}>
            {data.outputEffectTotal}
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            影响产量(支)
          </div>
        </div>
      </div>
    </div>
  )
}
