import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext'

export const Tabs = (props) => {
  const { navigateToDetail } = useCurrentApp()
  return (
    <div
      style={{
        background: '#F5F5F5',
        padding: '12px 12px 12px 0',
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          paddingLeft: 12,
          fontFamily: 'PingFang SC',
          fontWeight: 400,
          height: 24,
          lineHeight: '24px',
          fontSize: 12,
        }}
      >
        集团人效
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          onClick={() => {
            navigateToDetail({ type: 'group', groupTab: '总人均产能' })
          }}
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
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 8, right: 2 }}>
            <img src={require('../../../assets/icons/costright.svg')} alt="" />
          </div>
          <div style={{ color: '#333', fontSize: '16px', fontWeight: 700 }}>
            30
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            总人均产能(Kwh/h)
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
            position: 'relative',
          }}
          onClick={() => {
            navigateToDetail({ type: 'group', groupTab: '一线人均产能' })
          }}
        >
          <div style={{ position: 'absolute', top: 8, right: 2 }}>
            <img src={require('../../../assets/icons/costright.svg')} alt="" />
          </div>
          <div style={{ color: '#333', fontSize: '16px', fontWeight: 700 }}>
            50
          </div>
          <div
            style={{
              color: '#969696',
              fontSize: '12px',
            }}
          >
            一线人均产能(Kwh/h)
          </div>
        </div>
      </div>
    </div>
  )
}
