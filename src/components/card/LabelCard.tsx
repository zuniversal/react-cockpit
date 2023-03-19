import { useWindowWidth } from '@react-hook/window-size'
import { Card } from 'antd-mobile'
import type { CardProps } from 'antd-mobile/es/components/card'

import style from './LabelCard.module.less'

type KeyValuePair = {
  label: string | number
  value: string | number
  labelColor?: string
  valueColor?: string
  icon?: string
  style?: { [key: string]: any }
  hiddent?: boolean
  bodyStyle?: boolean
}

type KeyValuePairRow = KeyValuePair | KeyValuePair[]

function Pair(props: KeyValuePair) {
  return (
    <div
      style={
        props.style || {
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          fontFamily: 'PingFang SC',
        }
      }
    >
      <div
        style={{
          color: props.valueColor || '#09101D',
          fontFamily: 'DIN',
          fontSize: 13,
          marginBottom: '3px',
        }}
      >
        {props.value}
        {props.icon && (
          <img
            style={{
              marginLeft: '4px',
            }}
            src={
              props.icon ||
              require('../../assets/icons/batttery-charging-fill.svg')
            }
            alt=""
          />
        )}
      </div>
      <div
        style={{
          color: props.labelColor || '#5D6C8F',
        }}
      >
        {props.label}
      </div>
    </div>
  )
}

export function LabelCard(
  props: CardProps & {
    title: string
    titleIcon?: string
    hiddent?: boolean
    rows: KeyValuePairRow[]
  }
) {
  const { title, rows, ...cardProps } = props
  const windowWidth = useWindowWidth()
  const flatten = windowWidth < 480
  return (
    <div
      style={
        props.hiddent || false
          ? {
              display: 'none',
            }
          : {
              position: 'relative',
              zIndex: 103,
            }
      }
    >
      <Card
        {...cardProps}
        className={props.bodyStyle ? style.labelCardActive : style.labelCard}
        // title={item.type}
        headerStyle={{
          fontSize: 11,
          borderBottom: 0,
          paddingTop: 10,
          paddingBottom: 0,
        }}
        bodyStyle={{
          paddingTop: 6,
          paddingBottom: 10,
        }}
        title={
          <div
            style={{
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'PingFang SC',
              color: '#373737',
            }}
          >
            <img src={props.titleIcon} alt="" />
            <p
              style={{
                margin: 0,
              }}
            >
              {props.title}
            </p>
          </div>
        }
      >
        <div>
          {props.rows.map((row, index) => {
            if (Array.isArray(row)) {
              if (flatten) {
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    {row.map((pair) => {
                      return <Pair key={pair.label} {...pair} />
                    })}
                  </div>
                )
              }
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'space-around',
                  }}
                >
                  {row.map((pair) => {
                    return <Pair key={pair.label} {...pair} />
                  })}
                </div>
              )
            }
            return <Pair key={row.label + Math.random()} {...row} />
          })}
        </div>
      </Card>
    </div>
  )
}
