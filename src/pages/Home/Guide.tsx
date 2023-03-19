import { useEffect, useState } from 'react'

import poke from '../../assets/guide/Poke.svg'
import pokeLine from '../../assets/guide/PokeLine.svg'
import bottom from '../../assets/guide/bottom.svg'
import close from '../../assets/guide/close.svg'
import follow from '../../assets/guide/follow.svg'
import hand2 from '../../assets/guide/hand2.svg'
import head from '../../assets/guide/head.svg'
import line from '../../assets/guide/line.svg'
import line2 from '../../assets/guide/line2.svg'
import top from '../../assets/guide/top.svg'
import update from '../../assets/guide/update.svg'
import weidu from '../../assets/guide/weidu.png'
import styles from './Guide.module.less'

type KeyValueCard = {
  title: string
  content: string
  line?: { [key: string]: any }
  hand?: { [key: string]: any }
  stepBtn?: { [key: string]: any }
  btnContent: string
  onHandleClickNext
  onHandleClickSkip
  isAnimation?: boolean
}

function StepCard(props: KeyValueCard) {
  return (
    <div className={styles.box}>
      {props.line && (
        <img
          className={styles.line}
          src={props.line.name}
          style={props.line.style}
        />
      )}
      {props.hand && (
        <img
          className={styles.hand}
          src={props.hand.name}
          style={props.hand.style}
        />
      )}
      {props.isAnimation && (
        <div className={styles.pokeBox}>
          <img className={styles.pokeLine} src={pokeLine} />
          <img className={styles.poke} src={poke} />
        </div>
      )}
      <div className={styles.title}>
        <span>{props.title}</span>
        <img
          className={styles.close}
          src={close}
          onClick={props.onHandleClickSkip}
        />
      </div>
      <div className={styles.con}>{props.content}</div>
      <div className={styles.btn}>
        {props.stepBtn && (
          <div className={styles.skip} onClick={props.onHandleClickSkip}>
            跳过{props.stepBtn.step}/5
          </div>
        )}

        <div className={styles.next} onClick={props.onHandleClickNext}>
          {props.btnContent}
        </div>
      </div>
    </div>
  )
}

export function Guide(props) {
  const height = window.screen.height
  const [step, setStep] = useState(1)

  useEffect(() => {}, [])

  function onHandleClickNext() {
    if (step === 5) {
      onHandleClickSkip()
    }
    setStep(step + 1)
  }

  function onHandleClickSkip() {
    props.callback(false)
    window.localStorage.setItem('firstLogin', false)
    document.getElementsByTagName('body')[0].removeAttribute('class')
  }

  function step1() {
    return (
      <div className={styles.steps1}>
        <img className={styles.head} src={head} />
        <StepCard
          line={{ name: line }}
          title="关注您最在意的指标"
          content="点击指标库可查看到所有指标，里面会有更详细的内容哦～"
          stepBtn={{ step: 1 }}
          btnContent="下一步"
          onHandleClickNext={onHandleClickNext}
          onHandleClickSkip={onHandleClickSkip}
        />
      </div>
    )
  }

  function step2() {
    return (
      <div className={styles.steps2}>
        <img className={styles.follow} src={follow} />
        <StepCard
          line={{ name: line2 }}
          title="取消关注"
          content="不想看的指标也可以从这里取消关注哦"
          stepBtn={{ step: 2 }}
          btnContent="下一步"
          onHandleClickNext={onHandleClickNext}
          onHandleClickSkip={onHandleClickSkip}
        />
      </div>
    )
  }

  function step3() {
    return (
      <div className={styles.steps3}>
        <img className={styles.marginAuto} src={top} />
        <StepCard
          title="拖动"
          content="如果关注多个指标可上下滑动浏览哦"
          stepBtn={{ step: 3 }}
          isAnimation
          btnContent="下一步"
          onHandleClickNext={onHandleClickNext}
          onHandleClickSkip={onHandleClickSkip}
        />
        <img className={styles.marginAuto} src={bottom} />
      </div>
    )
  }

  function step4() {
    return (
      <div className={styles.steps4}>
        <img src={update} />
        <StepCard
          line={{ name: line, style: { right: '26%' } }}
          title="下拉刷新"
          content="从顶部向下拖动，可即时刷新动态指标的数据"
          isAnimation
          stepBtn={{ step: 4 }}
          btnContent="下一步"
          onHandleClickNext={onHandleClickNext}
          onHandleClickSkip={onHandleClickSkip}
        />
      </div>
    )
  }

  function step5() {
    return (
      <div className={styles.steps5}>
        <StepCard
          title="查看详情"
          content="点击指标的不同维度会有更详细的数据信息哦"
          hand={{
            name: hand2,
            style: {
              left: '-24px',
              top: '62px',
            },
          }}
          line={{
            name: line2,
            style: {
              top: 132,
            },
          }}
          btnContent="知道啦"
          onHandleClickNext={onHandleClickNext}
          onHandleClickSkip={onHandleClickSkip}
        />
        <img className={styles.weidu} src={weidu} style={{ width: '88%' }} />
      </div>
    )
  }

  return (
    <div
      className={styles.guide}
      style={{
        height,
      }}
    >
      {/* 第一步 */}
      {step === 1 && step1()}

      {/* 第二步 */}
      {step === 2 && step2()}

      {/* 第三步 */}
      {step === 3 && step3()}

      {/* 第四步 */}
      {step === 4 && step4()}

      {/* 第五步 */}
      {step === 5 && step5()}
    </div>
  )
}
