import { SafeArea } from 'antd-mobile'
import { useLocation, useParams } from 'react-router-dom'

import { BottomTabbar } from './BottomTabbar'
import { useUser } from '../user'
import { AppLoader } from './AppLoader'
import { useApps } from './AppsContext'
import styles from './styles.module.less'

export function TabbarView(props) {
  const { pathname } = useLocation()
  const user = useUser()
  const apps = useApps()
  const { following } = user

  return (
    <div className={styles.app}>
      {pathname === '/' && (
        <AppLoader
          apps={apps}
          user={user}
          following={following}
          appName="home"
        />
      )}
      {pathname === '/news' && (
        <AppLoader
          apps={apps}
          user={user}
          following={following}
          appName="news"
        />
      )}
      {pathname === '/radar' && (
        <AppLoader
          apps={apps}
          user={user}
          following={following}
          appName="radar"
        />
      )}
      {pathname === '/me' && (
        <AppLoader apps={apps} user={user} following={following} appName="me" />
      )}
      <div>
        <div style={{ height: 49 }} />
        <SafeArea position="bottom" />
      </div>
      <div className={styles.bottom}>
        <BottomTabbar />
      </div>
    </div>
  )
}
