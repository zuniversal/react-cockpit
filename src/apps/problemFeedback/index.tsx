import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { ProblemFeedback } from './problemFeedback'
export default function problemFeedbackApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>问题反馈</HeadTitle>
      <ProblemFeedback />
    </CurrentAppContext.Provider>
  )
}
