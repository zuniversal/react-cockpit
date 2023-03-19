import { useState } from 'react'

import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { Home } from './Home'

export default function HomeApp(props) {
  const [date, setDate] = useState(new Date())

  return (
    <CurrentAppContext.Provider
      value={{
        ...props,
        date,
        setDate,
      }}
    >
      <Home />
    </CurrentAppContext.Provider>
  )
}
