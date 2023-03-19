import {
  AutoCenter,
  Button,
  ErrorBlock,
  Grid,
  ResultPage,
  Space,
} from 'antd-mobile'
import { useNavigate, useRoutes } from 'react-router-dom'

import styles from './styles.module.less'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <ErrorBlock status="empty" />

      <Button onClick={() => navigate('/', { replace: true })}>返回首页</Button>
    </div>
  )
}
