import blank from '../../assets/icons/blank.png'
import styles from './styles.module.less'

export function PcTips(props) {
  return (
    <div className={styles.pcTips}>
      <img src={blank} />
      <div>{props.message || 'PC端无法访问,请前往移动端查看'}</div>
    </div>
  )
}
