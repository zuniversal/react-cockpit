import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Notify } from './notify'
export default function NotifyApp(props) {
  const { user } = props
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>消息通知</HeadTitle>
      <Notify />
    </CurrentAppContext.Provider>
  )
}
