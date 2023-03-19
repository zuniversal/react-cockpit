import { ErrorBlock } from 'antd-mobile'
import {
  MutableRefObject,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useElementScroll } from '../../hooks/useElementScroll'
import { Loading } from '../loading/Loading'
import { Table, TableProps } from './Table'

export function InfiniteTable(
  props: Omit<TableProps, 'data'> & {
    scrollRef?: MutableRefObject<HTMLElement>
    loadMore: (
      pageNo: number
    ) => Promise<{ records: any[]; total: number; current: number }>
    onEndReachedThreshold?: number
  }
) {
  const {
    scrollRef,
    loadMore,
    onEndReachedThreshold = 200,
    onChange: propsOnChange,
    ...tableProps
  } = props
  const { scrollTop, scrollHeight, scrollBottom, offsetHeight } =
    useElementScroll(scrollRef)
  const [tableData, setTableData] = useState([])

  const endReached = useRef<any>()
  // const [pageNo, setPageNo] = useState(0)
  // const [end, setEnd] = useState(false)
  // const [init, setInit] = useState(false)

  const [{ pageNo, end, init }, setState] = useState({
    pageNo: 0,
    end: false,
    init: false,
  })

  const loading = useRef(false)
  const [error, setError] = useState(null)

  const loadMore2 = useCallback(
    async (pageNo: number) => {
      if (loading.current) {
        return
      }
      loading.current = true
      setError(null)

      try {
        const result = await loadMore(pageNo + 1)
        if (result.records.length === 0) {
          setState((prev) => ({ ...prev, end: true }))
          return
        }
        // setPageNo(result.current)
        setState((prev) => ({ ...prev, pageNo: result.current }))

        setTableData((prev) => {
          return prev.concat(result.records)
        })
      } catch (e) {
        setError(e)
      } finally {
        loading.current = false
      }
    },
    [loadMore]
  )

  const onEndReached = useCallback(
    (pageNo) => {
      if (!end) {
        loadMore2(pageNo)
      }
    },
    [loadMore2, end]
  )

  useEffect(() => {
    const condition = scrollBottom - scrollHeight + onEndReachedThreshold >= 0
    if (condition || !init) {
      console.log('init or end reach', pageNo)
      setState((prev) => ({ ...prev, init: true }))
      if (endReached.current) {
        endReached.current(pageNo)
      }
    }
  }, [
    pageNo,
    init,
    scrollBottom,
    scrollTop,
    scrollHeight,
    offsetHeight,
    onEndReachedThreshold,
  ])

  const onChange = useCallback(
    (state) => {
      setState({ pageNo: 0, init: false, end: false })
      setTableData([])
      if (propsOnChange) {
        propsOnChange(state)
      }
    },
    [propsOnChange]
  )

  useEffect(() => {
    endReached.current = onEndReached
  }, [onEndReached])

  if (error) {
    return <ErrorBlock description={error.message} />
  }

  return (
    <div>
      <Table data={tableData} {...tableProps} onChange={onChange} />
      {!end && <Loading style={{ height: 50 }} />}
    </div>
  )
}
