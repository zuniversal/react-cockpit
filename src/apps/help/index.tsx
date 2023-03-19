import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Help } from './help'
export default function HelpApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>问题帮助</HeadTitle>
      <Help />
    </CurrentAppContext.Provider>
  )
}
