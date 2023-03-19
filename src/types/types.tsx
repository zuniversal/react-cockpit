import { AppsState } from '../contexts/apps'
import { UserState } from '../contexts/user'
import { FollowItem } from '../contexts/user/UserContext'

export type MicroAppProps = Record<string, any> & {
  appName: string
  indicator?: FollowItem
  user?: UserState
  apps?: AppsState
  cache?: any
  setCache?: (cache: any) => void
}
