import React from 'react'
import classnames from 'classnames'

import { makeStyles, Theme, Typography } from '@material-ui/core'

import BaseButton, { BaseButtonProps } from '../../atoms/BaseButton'

import { useUniqueId } from '../../../utils/useUniqueId'

export interface FileInputProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange' | 'label'> {
  displayFileName?: boolean,
  buttonProps?: BaseButtonProps,
  onChange: (file: File ) => void,
  file?: File,
  error?: Error | null,
}

const useStyles = makeStyles<Theme, FileInputProps>((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonUpload: {
    marginLeft: 0,
    marginRight: 20,
  },
  button: {
    width: 123,
    height: 32,
    boxShadow: 'none',
  },
}), { name: 'FileInput' } )

export const FileInput = (props: FileInputProps) => {
  const componentId = useUniqueId('FileInput')
  const classes = useStyles(props)
  const {
    displayFileName = true,
    buttonProps = {},
    file = null,
    error = null,
    children,
    onChange,
    ...otherProps
  } = props

  const { className: buttonClassName, ...otherButtonProps } = buttonProps

  const fileChangeHandler = React.useCallback((event) => {
    event?.target?.files && onChange(event?.target?.files[0])
  }, [onChange])

  return (
    <div
      className={classes.root}
      {...otherProps}
    >
      <div
        className={classes.wrapper}
      >
        <input
          id={componentId}
          onChange={fileChangeHandler}
          type={'file'}
          hidden={true}
          multiple={false}
        />
        <label htmlFor={componentId}>
          <BaseButton<'span'>
            className={classnames([
              classes.button,
              classes.buttonUpload,
              buttonClassName,
            ])}
            buttonVariant={'black'}
            {...otherButtonProps}
            component={'span'}
          >
            {children || 'Browse files...'}
          </BaseButton>
        </label>
        {
          displayFileName ?
            <Typography
              noWrap={true}
            >
              {file && file.name}
              {error && error.message}
            </Typography>
            :
            null
        }
      </div>
    </div>
  )
}

export default FileInput
