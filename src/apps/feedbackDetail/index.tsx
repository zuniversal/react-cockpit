import { HeadTitle } from '../../components/helmet'
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { FeedbackDetail } from './feedbackDetail'
import { getUrlParams } from '../../utils'
export default function FeedbackDetailApp(props) {
  const { user } = props
  const type = getUrlParams('type')
  const title = type === 'notify' ? '详细消息' : '反馈历史'
  const pageName =
    title === '详细消息'
      ? '我的_消息通知_详情消息'
      : '问题帮助_反馈历史_反馈详情'
  return (
    <CurrentAppContext.Provider value={props}>
      <HeadTitle>{title}</HeadTitle>
      <FeedbackDetail title={title} pageName={pageName} />
    </CurrentAppContext.Provider>
  )
}
