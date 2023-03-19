import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { CardMode } from './CardMode'
import { DetailMode } from './DetailMode'

export default function Metric(props) {
  return (
    <CurrentAppContext.Provider value={props}>
      {props.mode === 'card' && <CardMode />}
      {props.mode === 'detail' && <DetailMode />}
    </CurrentAppContext.Provider>
  )
}
