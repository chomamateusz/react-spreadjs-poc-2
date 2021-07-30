import React from 'react'
import classNames from 'classnames'

import { Button, ButtonProps } from '@material-ui/core'

type ButtonVariant = 'next' | 'previous' | 'draft' | 'upload' | 'black' | 'cancel' | 'success' | 'remove' | 'lightBlack' | 'danger'

export type BaseButtonProps<C extends React.ElementType = 'button'> = ButtonProps<C, { component?: C }> & {
  buttonVariant?: ButtonVariant,
}

export const BaseButton = <C extends React.ElementType = 'button'>(props: BaseButtonProps<C>) => {
  const {
    className,
    ...otherProps
  } = props

  return (
    <Button
      className={classNames([
        className,
      ])}
      {...otherProps}
    >
    </Button>
  )
}

export default BaseButton
