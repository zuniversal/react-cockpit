import { SafeArea, TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
// import { useLocation, useNavigate } from 'react-router-dom'
import { useLocation, useNavigate } from 'umi'
import { Badge, Space } from 'antd-mobile'
import b2 from '@/assets/tabbaricons/b2.svg'
import b1 from '@/assets/tabbaricons/b1.svg'
import c2 from '@/assets/tabbaricons/c2.svg'
import c1 from '@/assets/tabbaricons/c1.svg'
import d2 from '@/assets/tabbaricons/d2.svg'
import d1 from '@/assets/tabbaricons/d1.svg'
import a2 from '@/assets/tabbaricons/a2.svg'
import a1 from '@/assets/tabbaricons/a1.svg'


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
          icon={b2}
          activeIcon={b1}
        />
      ),
    },
    {
      key: '/news',
      title: '资讯',
      icon: (active) => (
        <TabbarIcon
          active={active}
          icon={c2}
          activeIcon={c1}
        />
      ),
    },
    {
      key: '/radar',
      title: '雷达',
      icon: (active) => (
        <TabbarIcon
          active={active}
          icon={d2}
          activeIcon={d1}
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
            icon={a2}
            activeIcon={a1}
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
