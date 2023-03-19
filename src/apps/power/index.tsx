import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Power } from './power'
export default function PowerApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>权限说明</HeadTitle>
      <Power />
    </CurrentAppContext.Provider>
  )
}
