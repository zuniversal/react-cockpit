export const LoadTabs = (props) => {
  return (
    <div
      style={{
        background: '#F5F5F5',
        padding: '12px 12px 12px 0',
        borderRadius: '6px',
      }}
    >
      <div style={{ color: '#333', padding: '0 12px 12px' }}>产线整体情况</div>
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
          <div style={{ color: '#F1965C', fontSize: '16px', fontWeight: 700 }}>
            2.17
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            产能差异(Gwh)
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
            109%
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            负荷率
          </div>
        </div>
      </div>
    </div>
  )
}
