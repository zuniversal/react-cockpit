import { ForbidFill } from 'antd-mobile-icons'
import React from 'react'

import { Action, ActionProps } from './Action'

export function Remove(props: ActionProps) {
  return (
    <Action
      {...props}
      active={{
        fill: 'rgba(255, 70, 70, 0.95)',
        background: 'rgba(255, 70, 70, 0.1)',
      }}
    >
      <ForbidFill fontSize={16} color="rgba(240, 74, 74, 1)" />
    </Action>
  )
}
