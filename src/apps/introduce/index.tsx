import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { getUrlParams } from '../../utils'
import { Introduce } from './introduce'

export default function introduceApp(props) {
  const { user } = props
  const type = getUrlParams('type')

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>功能介绍</HeadTitle>
      <Introduce />
    </CurrentAppContext.Provider>
  )
}
