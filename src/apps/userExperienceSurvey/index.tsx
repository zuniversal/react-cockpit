import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { UserExperienceSurvey } from './userExperienceSurvey'
export default function userExperienceSurveyApp(props) {
  const { user } = props

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>用户体验调研</HeadTitle>
      <UserExperienceSurvey />
    </CurrentAppContext.Provider>
  )
}
