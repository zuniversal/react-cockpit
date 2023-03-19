export const Tabs = (props) => {
  const { data, currentUnit } = props
  return (
    <div
      style={{
        background: '#F5F5F5',
        padding: '12px 12px 12px 0',
        borderRadius: '6px',
        display: 'flex',
      }}
    >
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
          {data[0].实际人效}
        </div>
        <div
          style={{
            color: '#969696',
            fontSize: '12px',
          }}
        >
          实际人效({currentUnit})
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
          {data[0].目标人效}
        </div>
        <div
          style={{
            color: '#969696',
            fontSize: '12px',
          }}
        >
          目标人效({currentUnit})
        </div>
      </div>
    </div>
  )
}
