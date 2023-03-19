import { Button, Card } from 'antd-mobile'
import { useMemo, useState } from 'react'

import { Pagination } from '../../components/pagination'
import { Table } from '../../components/table'
import { SegmentedControls } from '../../components/tabs/SegmentedControls'
import { sendBuriedPoint } from '../../utils/index'
import moment from 'moment'
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
export default function Dev() {
  const { user } = useCurrentApp()
  const { token } = user
  const [page, setPage] = useState(1)
  const [segmentKey, setSegmentedControlsActiveKey] = useState('2')
  const logs = useMemo(() => {
    const logsText = localStorage.getItem('logs')
    if (!logsText) {
      return []
    }
    let logsJSON = []
    try {
      logsJSON = JSON.parse(logsText)
      if (!Array.isArray(logsJSON)) {
        logsJSON = []
      }
    } catch (e) {
      logsJSON = []
    }
    return logsJSON
  }, [])
  return (
    <div
      style={{
        backgroundColor: '#EEEFF3',
        padding: 10,
        minHeight: '100vh',
      }}
    >
      <Card
        title="分页"
        style={{ marginBottom: 10 }}
        extra="比设计稿大了点，还需要调整"
      >
        <Pagination current={page} onChange={setPage} total={10} />
      </Card>

      <Card title="分段控件" style={{ marginBottom: 10 }}>
        <SegmentedControls
          tabs={[
            { title: '客户', key: '1' },
            { title: '基地', key: '2' },
          ]}
          // onChange={(key) => {
          //   // 事件埋点
          //   sendBuriedPoint(
          //     token,
          //     '',
          //     '',
          //     '',
          //     '/',
          //     key === '1' ? '客户' : '基地',
          //     '0',
          //     moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
          //   )
          // }}
        />
        <div style={{ height: 10 }} />
        <SegmentedControls
          activeKey={segmentKey}
          onChange={(key) => setSegmentedControlsActiveKey(key)}
          tabs={[
            { key: '1', title: '标准成本' },
            { key: '2', title: '实际成本' },
          ]}
        />
      </Card>

      <Card title="表格" style={{ marginBottom: 10 }} extra="排序按钮还没做">
        <Table
          columns={[
            { name: 'name1', label: '产品型号' },
            { name: 'name2', label: '计划产能' },
            { name: 'name3', label: '实际产能' },
            { name: 'name4', label: '产能达成率' },
          ]}
          data={[
            {
              name1: 1,
              name2: 2,
              name3: 4,
              name4: 5,
            },
            {
              name1: 1,
              name2: 2,
              name3: 4,
              name4: 5,
            },
            {
              name1: 1,
              name2: 2,
              name3: 4,
              name4: 5,
            },
            {
              name1: 1,
              name2: 2,
              name3: 4,
              name4: 5,
            },
          ]}
        />
      </Card>

      <Card title="调试" style={{ marginBottom: 10 }}>
        <Button onClick={() => localStorage.clear()}>清除localStorage</Button>
      </Card>

      <Card title="日志" style={{ marginBottom: 10 }}>
        <Table
          columns={[
            { name: 'level', label: 'level' },
            { name: 'message', label: 'message' },
          ]}
          data={logs}
        />
      </Card>
    </div>
  )
}
