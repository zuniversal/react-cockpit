import { CurrentAppProvider } from '../../contexts/apps/CurrentAppProvider'
import { CardMode } from './CardMode'
import { DetailMode } from './DetailMode'

export default function Market(props) {
  return (
    <CurrentAppProvider value={props}>
      {props.mode === 'card' && <CardMode />}
      {props.mode === 'detail' && <DetailMode />}
    </CurrentAppProvider>
  )
}
