import { Button, Form, Input, Toast } from 'antd-mobile'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { HeadTitle } from '../../components/helmet'
import { Loading } from '../../components/loading/Loading'
import { isWxWork } from '../../utils'
import { useUser } from '../user'
import { PcTips } from './pcTips'
export function Login() {
  const { loginType } = useParams()
  const [result, setResult] = useState('')
  const [captchUrl, setCaptchUrl] = useState('')
  const [checkKey, setCheckKey] = useState('')
  const { setToken, getFailTimes } = useUser()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initSysLogin = useCallback(async () => {
    const checkKey = Math.random().toString().slice(2)
    const captchRes = await fetch(`/api/sys/randomImage/${checkKey}`)

    const captchJson = await captchRes.json()
    setCheckKey(checkKey)
    setCaptchUrl(captchJson.result)
  }, [])

  const sysLogin = useCallback(
    async (args) => {
      try {
        const res = await fetch(`/api/sys/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            ...args,
            checkKey,
          }),
        })

        const json = await res.json()

        if (json.success) {
          Toast.show(json.message)
          setToken(json.result.token)
          window.localStorage.setItem('reloadNum', '1')
          localStorage.setItem('firstLogin', json.result.firstLogin)
          navigate('/', { replace: true })
        } else {
          throw new Error(json.message)
        }
      } catch (e) {
        Toast.show(e.message)
      }
    },
    [checkKey, setToken, navigate]
  )

  //企微登录
  const wxLogin = useCallback(() => {
    const url = new URL(location.href)
    let source: string = url.searchParams.get('source') || 'zd'
    const state = encodeURIComponent(`${window.location.origin}/login/token`)
    location.href = `${process.env.WX_LOGIN_URL}?state=${state}&platform=ckpt&origin=${source}`
  }, [])

  useEffect(() => {
    if (getFailTimes() >= 10) {
      localStorage.setItem('datafrontcalb/error/wx-login-fail-times', '0')
      setToken('')
    }
    /**
     * 通过/login/wx登录
     */
    if (loginType === 'wx') {
      const url = new URL(`https://open.weixin.qq.com/connect/oauth2/authorize`)
      url.searchParams.set('appid', 'wx52b54ddc5ab405a4')
      url.searchParams.set(
        'redirect_uri',
        `${location.origin}/login/wx-callback`
      )
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('scope', 'snsapi_base')
      url.searchParams.set('state', 'STATE')
      location.href = url.toString()
    } else if (loginType === 'print') {
      setResult('location.href: ' + location.href)
    } else if (loginType === 'token') {
      const url = new URL(location.href)
      const token = url.searchParams.get('oauth2LoginToken')
      const firstLogin = url.searchParams.get('firstLogin')
      if (firstLogin) {
        window.localStorage.setItem('firstLogin', firstLogin)
      }
      if (token) {
        setToken(token)
        navigate('/', { replace: true })
      } else {
        Toast.show('参数无效')
        if (isWxWork()) {
          if (getFailTimes() < 10) {
            wxLogin()
          } else {
            initSysLogin()
          }
        } else {
          initSysLogin()
        }
      }
    } else {
      /**
       * 直接通过http://datafront.calb-tech.com访问应用
       */
      if (isWxWork()) {
        if (getFailTimes() < 10) {
          wxLogin()
        } else {
          initSysLogin()
        }
      } else {
        initSysLogin()
      }
    }
  }, [loginType, wxLogin, getFailTimes, initSysLogin, navigate, setToken])

  if (loginType === 'wx') {
    return <Loading />
  }

  if (loginType === 'token') {
    return <Loading />
  }

  if (loginType === 'print') {
    return <div>{result}</div>
  }

  if (isWxWork() && getFailTimes() < 10) {
    return <Loading />
  }

  // 不是企业微信登录时 判定是否有参数并且是y
  const test = searchParams.get('test')
  // 判定是否是PC端 isMove=false则是pc
  const [isMove, setIsMove] = useState(isMobile())
  window.onresize = function () {
    setIsMove(isMobile())
  }
  function isMobile() {
    let userAgentInfo = navigator.userAgent
    let Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ]
    let getArr = Agents.filter((i) => userAgentInfo.includes(i))
    return getArr.length ? true : false
  }

  return (
    <div>
      <HeadTitle>登录</HeadTitle>

      {isMove ? (
        <div>
          {test === 'y' ? (
            <Form
              layout="horizontal"
              footer={
                <Button block type="submit" color="primary" size="large">
                  提交
                </Button>
              }
              onFinish={sysLogin}
            >
              <Form.Item name="username">
                <Input placeholder="username" />
              </Form.Item>
              <Form.Item name="password">
                <Input type="password" placeholder="password" />
              </Form.Item>
              <Form.Item
                name="captcha"
                extra={
                  <div
                    onClick={() => {
                      initSysLogin()
                    }}
                  >
                    <img src={captchUrl} />
                  </div>
                }
              >
                <Input placeholder="captcha" />
              </Form.Item>
            </Form>
          ) : (
            <PcTips message="请在企业微信-工作台中打开应用" />
          )}
        </div>
      ) : (
        <PcTips />
      )}
    </div>
  )
}
