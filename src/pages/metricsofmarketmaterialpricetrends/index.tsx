import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { CardMode } from './CardMode'

export default function Market(props) {
  return (
    <CurrentAppContext.Provider value={props}>
      {props.mode === 'card' && <CardMode />}
    </CurrentAppContext.Provider>
  )
}
