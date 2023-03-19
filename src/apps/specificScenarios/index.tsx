import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { SpecificScenarios } from './specificScenarios'
export default function SpecificScenariosApp(props) {
  const { user } = props
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>具体场景</HeadTitle>
      <SpecificScenarios />
    </CurrentAppContext.Provider>
  )
}
