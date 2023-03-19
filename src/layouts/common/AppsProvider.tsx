import { PubSub } from 'pubsub-js'
import { Children, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  BrowserRouter as Router,
  createBrowserRouter,
  Location,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useMatches,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loading } from '../../components/loading/Loading'
import { useUser } from '../user'
import { AppLoader } from './AppLoader'
import { CardView } from './CardView'
import { DetailView } from './DetailView'
import { Login } from './Login'
import NotFound from './NotFound'
import { TabbarView } from './TabbarView'
import { PcTips } from './pcTips'

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

//路由拦截
function Interceptor({ children }) {
  //是否需要刷新
  // let isRefresh: string = '0'
  const navigate = useNavigate()
  const isRefresh = useRef('0')
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const test = searchParams.get('test')
    if (!isMobile()) {
      if (test === 'y') {
        navigate('/')
      } else {
        navigate('/pcTips')
      }
    }
    //订阅消息
    PubSub.subscribe('isRefresh', function (topic, message) {
      //message 为接收到的消息  这里进行业务处理
      isRefresh.current = message
      console.log(isRefresh.current === '5', '是否刷新状态')
    })
    if (isRefresh.current === '5') window.location.reload()
  }, [])
  return children
}

export function AppsProvider() {
  const user = useUser()
  const { menus, token, userInit } = user
  console.log('userInit', userInit)
  console.log('token', token)
  const routes = useMemo(() => {
    if (!userInit) {
      return [
        {
          path: '/',
          element: <Loading />,
        },
        {
          path: '*',
          element: <Loading />,
        },
        {
          path: '/:test',
          element: <Loading />,
        },
        {
          path: '/pcTips',
          element: <PcTips />,
        },
      ]
    }
    if (!token) {
      return [
        {
          path: '/login/:loginType',
          element: <Login />,
        },
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '*',
          element: <Login />,
        },
        {
          path: '/pcTips',
          element: <PcTips />,
        },
      ]
    }
    const recur = (options: any = {}) => {
      if (!options.children) {
        return []
      }
      return options.children.map((child) => {
        let element = <AppLoader appName={child.name} />
        if (child.name === 'detail') {
          element = <DetailView />
        } else if (child.name === 'card') {
          element = <CardView />
        } else if (['home', 'news', 'radar', 'me'].includes(child.name)) {
          element = <TabbarView />
        } else if (child.name === 'login') {
          element = <Login />
        } else if (child.name === 'pcTips') {
          element = <PcTips />
        }
        child.element && (element = child.element)
        return {
          path: child.path,
          element,
          children: recur(child),
        }
      })
    }

    const result = recur({ children: menus })

    result.push({ path: '*', element: <NotFound /> })
    return result
  }, [menus, token, userInit])

  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: routes,
      },
    ])
  }, [routes])

  //   router.routes[0]?.children?.map((item) => {
  //     item.element = <Interceptor>{item.element}</Interceptor>
  //   })
  //   return <RouterProvider router={router} fallbackElement={<Loading />} />
  return (
    <Router>
      <Routes>
        {router.routes[0].children.map((item) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={<Interceptor>{item.element}</Interceptor>}
            />
          )
        })}
      </Routes>
    </Router>
  )
}

function Layout() {
  const getKey = useCallback(
    (location: Location, matches: ReturnType<typeof useMatches>) => {
      const match = matches.find((m) => (m.handle as any)?.scrollMode)
      if ((match?.handle as any)?.scrollMode === 'pathname') {
        return location.pathname
      }

      return location.key
    },
    []
  )

  return (
    <>
      <Outlet />
      <ScrollRestoration getKey={getKey} />
    </>
  )
}
