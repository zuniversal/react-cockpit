import { useEffect } from 'react'
import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'

export default function Quit(props) {
  const { user } = props
  useEffect(() => {
    user.setToken(null)
  }, [])
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>退出登录</HeadTitle>
    </CurrentAppContext.Provider>
  )
}
