import { Divider, ErrorBlock } from 'antd-mobile'
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Pagination } from '../pagination'
import { Table, TableProps } from './Table'

export function PaginationTable(
  props: Omit<TableProps, 'data'> & {
    loadMore: (pageNo: number) => Promise<{
      records: any[]
      pages: number
      total: number
      current: number
      size: number
    }>
  }
) {
  const { loadMore, onChange: propsOnChange, ...tableProps } = props

  const [tableData, setTableData] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)
  const loading = useRef(false)
  const [error, setError] = useState(null)
  const [pageSize, setPageSize] = useState(10)

  const onChange = useCallback(
    (state) => {
      setTableData([])
      setPageNo(1)
      setTotal(0)
      if (propsOnChange) {
        propsOnChange(state)
      }
    },
    [propsOnChange]
  )

  const updateData = useCallback(
    async (pageNo: number) => {
      if (loading.current) {
        return
      }
      loading.current = true
      setError(null)

      try {
        const result = await loadMore(pageNo)
        setTableData(result.records)
        setTotal(result.pages)
        setPageSize(result.size ?? 10)
      } catch (e) {
        setError(e)
      } finally {
        loading.current = false
      }
    },
    [loadMore]
  )

  useEffect(() => {
    updateData(pageNo)
  }, [updateData, pageNo])

  if (error) {
    return <ErrorBlock description={error.message} />
  }

  return (
    <div>
      <Table
        data={tableData}
        {...tableProps}
        pageSize={pageSize}
        onChange={onChange}
        FooterComponent={
          <div>
            <Divider />
            <Pagination current={pageNo} total={total} onChange={setPageNo} />
          </div>
        }
      />
    </div>
  )
}
