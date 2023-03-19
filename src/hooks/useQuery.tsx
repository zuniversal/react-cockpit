import { useCallback, useMemo, useState } from 'react'

import { useRequest } from './useRequest'

/**
 * const {error, data, query} = useQuery('/saleForecast/selectSaleClassify')
 *
 * useEffect(() => {
 *  if (不需要参数) {
 *   query()
 *  } else {
 *   query({
 *     param1: 0
 *   })
 *  }
 * },[query])
 *
 * if (error) {
 *  // 说明有错误，返回错误信息
 *  return (
 *    <ErrorBlock status="default" description={error.message} />
 *  )
 * }
 *
 * if (!data) {
 *   // 在加载
 *   return <DotLoading />
 * }
 *
 * // 数据加载成功，渲染正常结果
 * return (
 *  <Plot data={data} />
 * )
 */
export function useQuery<T = any>(
  apiPath: string
): {
  error: Error | null
  data: null | T
  query: (params?: Record<string, any>, init?: RequestInit) => void
} {
  const [error, setError] = useState(null)
  const [data, setData] = useState<T>(null)
  const request = useRequest(apiPath)

  const query = useCallback(
    async (params: Record<string, any> = {}, init: RequestInit = {}) => {
      try {
        setError(null)
        setData(null)
        const json = await request(params, init)
        setData(json)
      } catch (e) {
        setError(e)
        setData(null)
      }
    },
    [request]
  )
  return useMemo(() => ({ error, data, query }), [error, data, query])
}
