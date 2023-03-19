import { createContext, useContext } from 'react'

import { MicroAppProps } from '../../types/types'

export const CurrentAppContext = createContext({} as MicroAppProps)

export const useCurrentApp = () => useContext(CurrentAppContext)
