import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { HelpDetail } from './helpDetail'
export default function HelpDetailApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>问题帮助</HeadTitle>
      <HelpDetail />
    </CurrentAppContext.Provider>
  )
}
