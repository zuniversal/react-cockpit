import { useNavigate, useParams } from 'react-router-dom'

import { useUser } from '../user'
import { AppLoader } from './AppLoader'
import { useApps } from './AppsContext'

export function CardView() {
  const routeParams = useParams()
  const navigate = useNavigate()
  const user = useUser()
  const apps = useApps()

  const navigateToDetail = (params = {}, options = {}) => {
    const url = new URL(location.origin)
    url.pathname = `/metrics/${routeParams.metricId}/detail`
    for (const key in params) {
      url.searchParams.set(key, params[key])
    }
    navigate(url.toString().slice(location.origin.length), options)
  }

  return (
    <AppLoader
      appName={routeParams.metricId}
      mode="card"
      user={user}
      apps={apps}
      navigateToDetail={navigateToDetail}
    />
  )
}
