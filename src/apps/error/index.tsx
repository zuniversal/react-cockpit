import { Empty } from 'antd-mobile'
import { useEffect } from 'react'

import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { getUrlParams } from '../../utils'

export default function Me(props) {
  const { user } = props

  console.log(getUrlParams('code'))
  const code = getUrlParams('code')
  const description = getUrlParams('description')

  useEffect(() => {}, [])

  return (
    <CurrentAppContext.Provider value={props}>
      <div
        style={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty
          image={require('../../assets/icons/empty2.svg')}
          imageStyle={{ width: '35vw' }}
          description={
            <div>
              <div
                style={{
                  textAlign: 'center',
                  lineHeight: '60px',
                  fontSize: 18,
                  color: '#34343F',
                  fontWeight: 'bold',
                }}
              >
                {code}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  lineHeight: '22px',
                  width: '66%',
                  margin: '0 auto',
                }}
              >
                {description}
              </div>
            </div>
          }
        />
      </div>
    </CurrentAppContext.Provider>
  )
}
