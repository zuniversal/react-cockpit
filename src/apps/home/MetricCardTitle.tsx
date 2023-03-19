import { Button, Popover, Modal } from 'antd-mobile'
import { QuestionCircleFill } from 'antd-mobile-icons'
import { ButtonRef } from 'antd-mobile/es/components/button'
import { PopoverRef } from 'antd-mobile/es/components/popover'
import moment from 'moment'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
import { useQuery } from '../../hooks/useQuery'
import { useRequest } from '../../hooks/useRequest'
import { sendBuriedPoint } from '../../utils/index'
import styles from './MetricCardTitle.module.less'
class CustomDate {
  constructor(date?: Date) {
    this.date = date || new Date()
    this.YYYY = this.date.getFullYear()
    this.M = this.date.getMonth() + 1
    this.D = this.date.getDate()
    this.H = this.date.getHours()
    this.m = this.date.getMinutes()
    this.S = this.date.getSeconds()
  }
  YYYY: number
  date: Date
  M: number
  D: number
  H: number
  m: number
  S: number
  get MM() {
    if (this.M < 10) {
      return `${0}${this.M}`
    }
    return `${this.M}`
  }
  get DD() {
    if (this.D < 10) {
      return `${0}${this.D}`
    }
    return `${this.D}`
  }
  get mm() {
    if (this.m < 10) {
      return `${0}${this.m}`
    }
    return `${this.m}`
  }

  get HH() {
    if (this.H < 10) {
      return `${0}${this.H}`
    }
    return `${this.H}`
  }

  get SS() {
    if (this.S < 10) {
      return `${0}${this.S}`
    }
    return `${this.S}`
  }

  get monthLastDay() {
    const nextMonth = this.M + 1
    const nextMonthFirstDay =
      nextMonth > 12
        ? new Date(`${this.YYYY + 1}.1.1`)
        : new Date(`${this.YYYY}.${nextMonth}.1`)
    const lastDay = new Date(nextMonthFirstDay.getTime() - 864000)
    return new CustomDate(lastDay)
  }

  get prevMonthLastDay() {
    const prevMonthLastDay = new Date(this.date.getTime() - this.D * 86400000)
    return new CustomDate(prevMonthLastDay)
  }

  get prevDay() {
    const prevDay = new Date(this.date.getTime() - 86400000)
    return new CustomDate(prevDay)
  }

  format(f: string) {
    let result = f

    result = result.replace(/YYYY/g, `${this.YYYY}`)
    result = result.replace(/MM/g, `${this.MM}`)
    result = result.replace(/DD/g, `${this.DD}`)
    result = result.replace(/HH/g, `${this.HH}`)
    result = result.replace(/mm/g, `${this.mm}`)
    result = result.replace(/SS/g, `${this.SS}`)

    return result
  }
}
export function MetricCardTitle(props) {
  const popover = useRef<PopoverRef>()
  const trigger = useRef<ButtonRef>()
  const [triggerLeft, setTriggerLeft] = useState(0)
  const { item, setEndDate, endDate } = props
  const { metricId, updateTime, id } = item
  const { user } = useCurrentApp()
  const { dateType, chooseDate, setMaterialPriceEndDate } = user
  const [visible, setVisible] = useState(false)
  const [modalHtml, setModalHtml] = useState()
  const requestDate = useRequest('indexlibrary/indexLibrary/queryMaxTime')
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  function formatDate(f: string, type) {
    const date = f
    switch (type) {
      case 'YYYY.MM':
        return date.replace(/-/g, '.').substring(0, 7)
      case '截至YYYY.MM':
        return `截至${date.replace(/-/g, '.').substring(0, 7)}`
      case 'YYYY.MM.DD':
        return date.replace(/-/g, '.').split(' ')[0]
      case '截至YYYY.MM.DD':
        return `截至${date.replace(/-/g, '.').split(' ')[0]}`
      case 'YYYY.MM.DD HH:mm':
        return date.replace(/-/g, '.').substring(0, 16)
      case '截至YYYY.MM.DD HH:mm':
        return `截至${date.replace(/-/g, '.').substring(0, 16)}`
    }
  }

  async function getEndDate(data, metricId, dateType) {
    const res = await requestDate(data, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'X-Access-Token': token,
      },
    })
    if (res.maxTimeList[0].indicatorName === '良率分析') {
      localStorage.setItem('yieldAnalysisTime', res.maxTimeList[0].maxTime)
    }
    const json = {}
    json[metricId] = {
      [dateType]: res.maxTimeList[0].maxTime,
    }
    const map = {
      //发货量
      metricsofdeliveryreached: {
        a: '',
        b:
          json['metricsofdeliveryreached'] &&
          json['metricsofdeliveryreached'].b &&
          formatDate(json['metricsofdeliveryreached'].b, '截至YYYY.MM.DD'),
        c:
          json['metricsofdeliveryreached'] &&
          json['metricsofdeliveryreached'].c &&
          formatDate(json['metricsofdeliveryreached'].c, '截至YYYY.MM.DD'),
      },
      // 毛利额
      // metricsofgrossprofitamount: {
      //   a: '',
      //   b:
      //     json['metricsofgrossprofitamount'] &&
      //     json['metricsofgrossprofitamount'].b &&
      //     formatDate(json['metricsofgrossprofitamount'].b, 'YYYY.MM'),
      //   c:
      //     json['metricsofgrossprofitamount'] &&
      //     json['metricsofgrossprofitamount'].c &&
      //     formatDate(json['metricsofgrossprofitamount'].c, '截至YYYY.MM'),
      // },
      // 库存
      metricsofinventory: {
        a: '',
        b:
          json['metricsofinventory'] &&
          json['metricsofinventory'].b &&
          formatDate(json['metricsofinventory'].b, '截至YYYY.MM.DD'),
        c:
          json['metricsofinventory'] &&
          json['metricsofinventory'].c &&
          formatDate(json['metricsofinventory'].c, '截至YYYY.MM.DD'),
      },
      // 生产
      // metricsofmanufacturing: {
      //   a:
      //     json['metricsofmanufacturing'] &&
      //     json['metricsofmanufacturing'].a &&
      //     formatDate(json['metricsofmanufacturing'].a, 'YYYY.MM.DD HH:mm'),
      //   b:
      //     json['metricsofmanufacturing'] &&
      //     json['metricsofmanufacturing'].b &&
      //     formatDate(json['metricsofmanufacturing'].b, '截至YYYY.MM.DD HH:mm'),
      //   c:
      //     json['metricsofmanufacturing'] &&
      //     json['metricsofmanufacturing'].c &&
      //     formatDate(json['metricsofmanufacturing'].c, '截至YYYY.MM.DD HH:mm'),
      // },
      // 边际额
      // metricsofmarginalamount: {
      //   a: '',
      //   b:
      //     json['metricsofmarginalamount'] &&
      //     json['metricsofmarginalamount'].b &&
      //     formatDate(json['metricsofmarginalamount'].b, 'YYYY.MM'),
      //   c:
      //     json['metricsofmarginalamount'] &&
      //     json['metricsofmarginalamount'].c &&
      //     formatDate(json['metricsofmarginalamount'].c, '截至YYYY.MM'),
      // },
      // 材料价格趋势
      metricsofmarketmaterialpricetrends: {
        a: '',
        b:
          json['metricsofmarketmaterialpricetrends'] &&
          json['metricsofmarketmaterialpricetrends'].b &&
          formatDate(
            json['metricsofmarketmaterialpricetrends'].b,
            'YYYY.MM.DD'
          ),
        c:
          json['metricsofmarketmaterialpricetrends'] &&
          json['metricsofmarketmaterialpricetrends'].c &&
          formatDate(
            json['metricsofmarketmaterialpricetrends'].c,
            'YYYY.MM.DD'
          ),
      },
      // // 销售额
      // metricsofsales: {
      //   a:
      //     json['metricsofsales'] &&
      //     json['metricsofsales'].a &&
      //     formatDate(json['metricsofsales'].a, 'YYYY.MM.DD'),
      //   b:
      //     json['metricsofsales'] &&
      //     json['metricsofsales'].b &&
      //     formatDate(json['metricsofsales'].b, '截至YYYY.MM.DD'),
      //   c:
      //     json['metricsofsales'] &&
      //     json['metricsofsales'].c &&
      //     formatDate(json['metricsofsales'].c, '截至YYYY.MM.DD'),
      // },
      // 损耗成本
      // metricsoflosscosts: {
      //   a:
      //     json['metricsoflosscosts'] &&
      //     json['metricsoflosscosts'].a &&
      //     formatDate(json['metricsoflosscosts'].a, 'YYYY.MM.DD'),
      //   b:
      //     json['metricsoflosscosts'] &&
      //     json['metricsoflosscosts'].b &&
      //     formatDate(json['metricsoflosscosts'].b, '截至YYYY.MM.DD'),
      //   c:
      //     json['metricsoflosscosts'] &&
      //     json['metricsoflosscosts'].c &&
      //     formatDate(json['metricsoflosscosts'].c, '截至YYYY.MM.DD'),
      // },
      // 产能
      // metricsofcapacity: {
      //   a:
      //     json['metricsofcapacity'] &&
      //     json['metricsofcapacity'].a &&
      //     formatDate(json['metricsofcapacity'].a, 'YYYY.MM.DD HH:mm'),
      //   b:
      //     json['metricsofcapacity'] &&
      //     json['metricsofcapacity'].b &&
      //     formatDate(json['metricsofcapacity'].b, '截至YYYY.MM.DD HH:mm'),
      //   c:
      //     json['metricsofcapacity'] &&
      //     json['metricsofcapacity'].c &&
      //     formatDate(json['metricsofcapacity'].c, '截至YYYY.MM.DD HH:mm'),
      // },
      // 良率分析
      // metricsofyieldanalysis: {
      //   a:
      //     json['metricsofyieldanalysis'] &&
      //     json['metricsofyieldanalysis'].a &&
      //     formatDate(json['metricsofyieldanalysis'].a, 'YYYY.MM.DD'),
      //   b:
      //     json['metricsofyieldanalysis'] &&
      //     json['metricsofyieldanalysis'].b &&
      //     formatDate(json['metricsofyieldanalysis'].b, '截至YYYY.MM.DD'),
      //   c:
      //     json['metricsofyieldanalysis'] &&
      //     json['metricsofyieldanalysis'].c &&
      //     formatDate(json['metricsofyieldanalysis'].c, '截至YYYY.MM.DD'),
      // },
      // 产品成本
      // metricsofproductcosts: {
      //   a: '',
      //   b:
      //     json['metricsofproductcosts'] &&
      //     json['metricsofproductcosts'].b &&
      //     formatDate(json['metricsofproductcosts'].b, 'YYYY.MM'),
      //   c:
      //     json['metricsofproductcosts'] &&
      //     json['metricsofproductcosts'].c &&
      //     formatDate(json['metricsofproductcosts'].c, '截至YYYY.MM'),
      // },
      // 市占与渗透
      metricsofmarketanalysis: {
        a: '',
        b:
          json['metricsofmarketanalysis'] &&
          json['metricsofmarketanalysis'].b &&
          formatDate(json['metricsofmarketanalysis'].b, 'YYYY.MM'),
        c:
          json['metricsofmarketanalysis'] &&
          json['metricsofmarketanalysis'].c &&
          formatDate(json['metricsofmarketanalysis'].c, '截至YYYY.MM'),
      },
      // 人工成本
      // metricsoflaborcost: {
      //   a: '',
      //   b:
      //     json['metricsoflaborcost'] &&
      //     json['metricsoflaborcost'].b &&
      //     formatDate(json['metricsoflaborcost'].b, 'YYYY.MM'),
      //   c:
      //     json['metricsoflaborcost'] &&
      //     json['metricsoflaborcost'].c &&
      //     formatDate(json['metricsoflaborcost'].c, '截至YYYY.MM'),
      // },
      // 工单统计
      // metricsofmarworkorderanalysis: {
      //   a: '',
      //   b:
      //     json['metricsofmarworkorderanalysis'] &&
      //     json['metricsofmarworkorderanalysis'].b &&
      //     formatDate(json['metricsofmarworkorderanalysis'].b, 'YYYY.MM'),
      //   c:
      //     json['metricsofmarworkorderanalysis'] &&
      //     json['metricsofmarworkorderanalysis'].c &&
      //     formatDate(json['metricsofmarworkorderanalysis'].c, '截至YYYY.MM'),
      // },
      // 人效结构
      // metricsofmanstructure: {
      //   a: '',
      //   b:
      //     json['metricsofmanstructure'] &&
      //     json['metricsofmanstructure'].b &&
      //     formatDate(json['metricsofmanstructure'].b, 'YYYY.MM'),
      //   c: '',
      // },
    }
    if (map[metricId]) {
      setEndDate(map[metricId][dateType])
      if (metricId == 'metricsofmarketmaterialpricetrends') {
        setMaterialPriceEndDate(map[metricId][dateType])
      }
    }
  }

  const dateText = useMemo(() => {
    const selectDay = new CustomDate(chooseDate)
    const queryDate = `${selectDay.YYYY}-${selectDay.MM}-${selectDay.DD}`
    // getEndDate(
    //   {
    //     queryDate,
    //     indicatorId: id,
    //   },
    //   metricId,
    //   dateType
    // )
    // try {
    //   /**
    //    * 今天
    //    */
    //   const selectDay = new CustomDate(chooseDate)
    //   const selectDayPrevMonth = selectDay.prevMonthLastDay
    //   const today = new CustomDate()
    //   const selectSameMonth = selectDay.M === today.M
    //   const prevDay = selectDay.prevDay
    //   const updateDay = new CustomDate(new Date(updateTime))
    //   const selectMonthLastDay = selectDay.monthLastDay

    //   const map = {
    //     //发货量
    //     metricsofdeliveryreached: {
    //       a: '',
    //       b: selectSameMonth
    //         ? prevDay.format('截至YYYY.MM.DD')
    //         : selectMonthLastDay.format('截至YYYY.MM.DD'),
    //       c: selectSameMonth
    //         ? prevDay.format('截至YYYY.MM.DD')
    //         : selectMonthLastDay.format('截至YYYY.MM.DD'),
    //     },
    //     // 毛利额
    //     metricsofgrossprofitamount: {
    //       a: '',
    //       b: selectDayPrevMonth.format('YYYY.MM'),
    //       c: selectDayPrevMonth.format('截至YYYY.MM'),
    //     },
    //     // 库存
    //     metricsofinventory: {
    //       a: '',
    //       b: updateDay.format('截至YYYY.MM.DD'),
    //       c: updateDay.format('截至YYYY.MM.DD'),
    //     },
    //     // 生产
    //     metricsofmanufacturing: {
    //       a: updateDay.format('YYYY.MM.DD HH:mm'),
    //       b: updateDay.format('截至YYYY.MM.DD HH:mm'),
    //       c: updateDay.format('截至YYYY.MM.DD HH:mm'),
    //     },
    //     // 边际额
    //     metricsofmarginalamount: {
    //       a: '',
    //       b: selectDayPrevMonth.format('YYYY.MM'),
    //       c: selectDayPrevMonth.format('截至YYYY.MM'),
    //     },
    //     // 材料价格趋势
    //     metricsofmarketmaterialpricetrends: {
    //       a: '',
    //       b: updateDay.format('YYYY.MM.DD'),
    //       c: updateDay.format('YYYY.MM.DD'),
    //     },
    //     // 销售额
    //     metricsofsales: {
    //       a: prevDay.format('YYYY.MM.DD'),
    //       b: prevDay.format('截至YYYY.MM.DD'),
    //       c: prevDay.format('截至YYYY.MM.DD'),
    //     },
    //   }

    //   return map[metricId][dateType]
    // } catch (e) {
    //   return updateTime
    // }
  }, [updateTime, dateType, chooseDate, metricId, id])

  const openPopover = useCallback(() => {
    let left = 0
    try {
      const rect = trigger.current.nativeElement.getBoundingClientRect()
      left = rect.left + rect.width / 2
      setTriggerLeft(left)
    } catch (e) {}
    popover.current?.show()
  }, [])

  return (
    <div className={styles.CardTitle}>
      <div className={styles.title}>
        <div
          style={{
            fontSize: 18,
            lineHeight: '22px',
          }}
        >
          {item.title}
        </div>

        <div style={{ width: 4 }} />
        {/* <Popover
          ref={popover}
          trigger="click"
          content={
            <div
              className={styles.multiLineContent}
              style={{
                maxWidth: `calc(100vw - ${triggerLeft + 24}px)`,
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: item.desc }}
                style={{
                  fontWeight: 500,
                  minWidth: 233,
                  minHeight: 50,
                  marginBottom: 12,
                }}
              />
              <Button
                block
                onClick={() => popover.current?.hide()}
                style={{
                  '--border-color': '#F7F7F7',
                  '--background-color': '#F7F7F7',
                }}
              >
                确定
              </Button>
            </div>
          }
          placement="bottom-start"
          mode="light"
        >
          <Button
            ref={trigger}
            style={{
              height: 24,
              width: 22,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              '--border-color': 'transparent',
              '--background-color': 'transparent',
            }}
            onClick={openPopover}
          >
            <QuestionCircleFill fontSize={18} color="rgba(139, 146, 158, 1)" />
          </Button>
        </Popover> */}
        <Button
          ref={trigger}
          style={{
            height: 24,
            width: 22,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            '--border-color': 'transparent',
            '--background-color': 'transparent',
          }}
          onClick={() => {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '查看注释',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `${trigger.current.nativeElement.previousElementSibling.previousElementSibling.innerHTML}`
            )

            setModalHtml(item.desc)
            setVisible(true)
          }}
        >
          <QuestionCircleFill fontSize={18} color="rgba(139, 146, 158, 1)" />
        </Button>
      </div>
      <div className={styles.subtitle}>
        {/* <span>{dateText}</span> */}
        <span>{endDate}</span>
      </div>
      <Modal
        visible={visible}
        title={
          <div style={{ textAlign: 'left' }}>
            <QuestionCircleFill fontSize={18} color="rgba(139, 146, 158, 1)" />
          </div>
        }
        content={
          <div
            dangerouslySetInnerHTML={{ __html: modalHtml }}
            style={{
              fontWeight: 500,
              minWidth: 233,
              minHeight: 50,
              marginBottom: 12,
            }}
          />
        }
        closeOnAction
        onClose={() => {
          setVisible(false)
        }}
        actions={[
          {
            key: 'confirm',
            text: '我知道了',
          },
        ]}
      />
    </div>
  )
}
