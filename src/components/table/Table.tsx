import { Button, Card, Divider, Popover } from 'antd-mobile'
import { DownOutline, DownFill } from 'antd-mobile-icons'
import type { CardProps } from 'antd-mobile/es/components/card'
import { ReactElement, useMemo } from 'react'

type Column = {
  name: string
  label: string
  sortable?: boolean
  render?: (data: any) => React.ReactNode
  renderColumnHeader?: (column: Column) => React.ReactNode
}

export type TableProps = CardProps & {
  columns: Column[]
  data: Record<string, any>[]
  orderBy: string
  sort: 'asc' | 'desc'
  pageSize?: number

  FooterComponent?: (() => JSX.Element) | ReactElement
  HeaderComponent?: (() => JSX.Element) | ReactElement
  onChange?: (state: Pick<TableProps, 'orderBy' | 'sort'>) => void
}

export function Table(props: TableProps) {
  const {
    data,
    columns,
    orderBy,
    sort,
    pageSize: pageSize0,
    onChange,
    FooterComponent,
    HeaderComponent,
    ...cardProps
  } = props

  const pageSize = useMemo(() => {
    if (typeof pageSize0 === 'number' && !isNaN(pageSize0)) {
      return pageSize0
    }
    return data.length
  }, [pageSize0, data])

  const orderByName = useMemo(() => {
    for (const item of columns) {
      if (item.name === orderBy) {
        return item.label
      }
    }
    return '默认'
  }, [columns, orderBy])

  const sortableColumns = useMemo(() => {
    return columns.filter((item) => {
      if (item.name === orderBy) {
        return false
      }
      return item.sortable === true
    })
  }, [columns, orderBy])

  const [ascColor, descColor] = useMemo(() => {
    if (sort === 'asc') {
      return ['#678EF2', '#D9D9D9']
    }
    return ['#D9D9D9', '#678EF2']
  }, [sort])

  const header = useMemo(() => {
    if (typeof HeaderComponent === 'function') {
      return <HeaderComponent />
    }
    if (HeaderComponent) {
      return HeaderComponent
    }
    return null
  }, [HeaderComponent])

  const footer = useMemo(() => {
    if (typeof FooterComponent === 'function') {
      return <FooterComponent />
    }
    if (FooterComponent) {
      return FooterComponent
    }
    return null
  }, [FooterComponent])

  return (
    <Card
      {...cardProps}
      headerStyle={{
        borderBottom: 'none',
        paddingBottom: 0,
        ...cardProps.style,
      }}
      extra={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: '12px',
            paddingTop: '12px',
          }}
        >
          <Popover.Menu
            actions={sortableColumns.map((item) => ({
              key: item.name,
              text: item.label,
            }))}
            placement="bottom-start"
            onAction={(node) => {
              if (node.key !== orderBy) {
                onChange({ orderBy: node.key as string, sort })
              }
            }}
            trigger="click"
          >
            <Button style={{ border: 0, fontSize: 14, color: '#373737' }}>
              {orderByName}顺序
              <DownOutline />
            </Button>
          </Popover.Menu>

          <Divider direction="vertical" style={{ margin: 0 }} />

          <Button
            style={{
              border: 0,
              color: '#373737',
            }}
            onClick={() => {
              onChange({
                orderBy: props.orderBy,
                sort: props.sort === 'asc' ? 'desc' : 'asc',
              })
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <DownFill
                color={ascColor}
                style={{ fontSize: 8, transform: 'rotate(180deg)' }}
              />
              <DownFill color={descColor} style={{ fontSize: 8 }} />
            </div>
          </Button>
        </div>
      }
    >
      {header}
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          // borderWidth: 0,
          // borderStyle: 'solid',
        }}
      >
        <thead style={{ borderBottomWidth: 1 }}>
          <tr
            style={{
              height: 38,
              color: '#A5A5A5',
            }}
          >
            {columns.map((column, index) => {
              const isFirstColumn = index === 0
              const isLastColumn = index === columns.length - 1
              let textAlign: any = 'center'
              if (isFirstColumn) {
                textAlign = 'left'
              } else if (isLastColumn) {
                textAlign = 'right'
              }
              return (
                <th
                  key={column.name}
                  style={{
                    borderBottom: '1px solid #EEEFF3',
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign,
                    padding: '0 12px',
                  }}
                >
                  {column.renderColumnHeader
                    ? column.renderColumnHeader(column)
                    : column.label}
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: pageSize }, (v, index) => {
            const row = data[index]
            const isLast = index === pageSize - 1
            const isFirst = index === 0
            return (
              <tr key={index} style={{}}>
                {columns.map((column, index2) => {
                  const isFistTd = isFirst && index2 === 0
                  const isLastTd = isFirst && index2 === columns.length - 1
                  const isFirstColumn = index2 === 0
                  const isLastColumn = index2 === columns.length - 1
                  let textAlign: any = 'center'
                  if (isFirstColumn) {
                    textAlign = 'left'
                  } else if (isLastColumn) {
                    textAlign = 'right'
                  }
                  return (
                    <td
                      key={column.name}
                      style={{
                        backgroundColor: index % 2 == 0 ? '#fff' : '#F0F4FC',
                        height: 36,
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: '#EEEFF3',
                        borderBottomStyle: 'solid',
                        borderTopLeftRadius: isFistTd ? 8 : 0,
                        borderTopRightRadius: isLastTd ? 8 : 0,
                        color: '#57565B',
                        fontSize: 12,
                        textAlign,
                        padding: '0 12px',
                      }}
                    >
                      {!row
                        ? ''
                        : column.render
                        ? column.render(row)
                        : row[column.name]}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {footer}
    </Card>
  )
}
