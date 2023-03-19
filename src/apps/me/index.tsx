import { Button, Empty } from 'antd-mobile'

import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Me } from './me'

export default function MeApp(props) {
  const { user } = props

  console.log(user)

  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>我的</HeadTitle>
      <Me />
    </CurrentAppContext.Provider>
  )
}
