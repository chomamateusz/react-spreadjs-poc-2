import React from 'react'

let idCounter = 0

export const useUniqueId = (prefix?: string): string => {
  const id = React.useMemo(() => idCounter++, [])
  return `${prefix ? `${prefix}-` : ''}${id}`
}

export default useUniqueId
