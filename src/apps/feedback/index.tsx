import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Feedback } from './feedback'
export default function FeedbackApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>反馈历史</HeadTitle>
      <Feedback />
    </CurrentAppContext.Provider>
  )
}
