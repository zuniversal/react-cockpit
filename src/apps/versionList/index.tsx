import { Button, Empty } from 'antd-mobile'

import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { VersionList } from './versionList'
export default function VersionListApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>版本信息</HeadTitle>
      <VersionList />
    </CurrentAppContext.Provider>
  )
}
