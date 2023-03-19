import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import Search from './Search'

export default function App(props) {
  return (
    <CurrentAppContext.Provider value={props}>
      <Search />
    </CurrentAppContext.Provider>
  )
}
