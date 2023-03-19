import { SafeArea, TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Space } from 'antd-mobile'

function TabbarIcon({ active, activeIcon, icon }: any) {
  return <img src={active ? activeIcon : icon} alt="" />
}

export function BottomTabbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value: string) => {
    navigate(value, { replace: true })
  }

  const tabs = [
    {
      key: '/',
      title: '关注',
      icon: (active) => (
        <TabbarIcon
          active={active}
          icon={require('../../../assets/tabbaricons/b2.svg')}
          activeIcon={require('../../../assets/tabbaricons/b1.svg')}
        />
      ),
    },
    {
      key: '/news',
      title: '资讯',
      icon: (active) => (
        <TabbarIcon
          active={active}
          icon={require('../../../assets/tabbaricons/c2.svg')}
          activeIcon={require('../../../assets/tabbaricons/c1.svg')}
        />
      ),
    },
    {
      key: '/radar',
      title: '雷达',
      icon: (active) => (
        <TabbarIcon
          active={active}
          icon={require('../../../assets/tabbaricons/d2.svg')}
          activeIcon={require('../../../assets/tabbaricons/d1.svg')}
        />
      ),
    },
    {
      key: '/me',
      title: '我的',
      icon: (active) => (
        <Badge
          content={
            localStorage.getItem('newsAmount') === '0'
              ? null
              : localStorage.getItem('newsAmount')
          }
        >
          <TabbarIcon
            active={active}
            icon={require('../../../assets/tabbaricons/a2.svg')}
            activeIcon={require('../../../assets/tabbaricons/a1.svg')}
          />
        </Badge>
      ),
    },
  ]

  return (
    <>
      <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      <SafeArea position="bottom" />
    </>
  )
}
