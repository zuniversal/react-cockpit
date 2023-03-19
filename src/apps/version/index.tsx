import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Version } from './version'
export default function VersionApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>版本信息</HeadTitle>
      <Version />
    </CurrentAppContext.Provider>
  )
}
