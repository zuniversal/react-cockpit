import { useCallback, useEffect, useState } from 'react'

import { CurrentAppContext } from './CurrentAppContext'

const cacheMap = new Map()

export function CurrentAppProvider(props) {
  const { value } = props
  const { appName } = value
  const [cache, setCache] = useState(cacheMap.get(appName) ?? {})

  const updateCache = useCallback((next) => {
    setCache((prev) => ({
      ...prev,
      ...next,
    }))
  }, [])

  useEffect(() => {
    cacheMap.set(appName, cache)
  }, [appName, cache])
  return (
    <CurrentAppContext.Provider
      value={{ cache, setCache: updateCache, ...value }}
    >
      {props.children}
    </CurrentAppContext.Provider>
  )
}
