import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { SkinCenter } from './skinCenter'
export default function SkinCenterApp(props) {
  const { user } = props
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>皮肤中心</HeadTitle>
      <SkinCenter />
    </CurrentAppContext.Provider>
  )
}
