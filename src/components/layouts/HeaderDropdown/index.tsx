import { Dropdown, Radio, Space } from 'antd-mobile'
import { ArrowDownCircleOutline, DownOutline } from 'antd-mobile-icons'
import React from 'react'

export function HeaderDropdown() {
  return (
    <Dropdown>
      <Dropdown.Item key="sorter" title="集团">
        <div style={{ padding: 12 }}>
          排序内容
          <br />
          排序内容
          <br />
          排序内容
          <br />
          排序内容
          <br />
        </div>
      </Dropdown.Item>
      <Dropdown.Item key="bizop" title="销售额">
        <div style={{ padding: 12 }}>
          商机筛选内容
          <br />
          商机筛选内容
          <br />
          商机筛选内容
          <br />
        </div>
      </Dropdown.Item>
      <Dropdown.Item key="more" title="更多筛选">
        <div style={{ padding: 12 }}>
          更多筛选内容
          <br />
          更多筛选内容
          <br />
        </div>
      </Dropdown.Item>
    </Dropdown>
  )
}
