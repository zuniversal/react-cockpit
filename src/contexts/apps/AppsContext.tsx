import { createContext, useContext } from 'react'

export type AppsState = any

export const AppsContext = createContext({} as AppsState)

export const useApps = () => useContext(AppsContext)
