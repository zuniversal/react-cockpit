import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { VersionDetail } from './versionDetail'
export default function VersionList(props) {
  const data = JSON.parse(localStorage.getItem('versionDetail'))
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>{`${data.releaseVersion}版本更新`}</HeadTitle>
      <VersionDetail />
    </CurrentAppContext.Provider>
  )
}
