import React from 'react'
import classnames from 'classnames'

import { makeStyles, Theme } from '@material-ui/core'

import BaseButton from '../../atoms/BaseButton'
import FileInput from '../../molecules/FileInput'

export interface PurchaserMenuButtonsProps extends React.HTMLProps<HTMLDivElement> {
  showPreview: boolean,
  onFileChange: (file: File) => void,
  onClickHidePreview: () => void,
  onClickShowPreview: () => void,
}

const useStyles = makeStyles<Theme, PurchaserMenuButtonsProps>((theme) => ({
  root: {
    display: 'flex',
  },
  menuButtonFile: {
    width: 93,
    color: `${theme.palette.common.black} !important`,
    backgroundColor: theme.palette.common.white,
    border: `0.5px solid ${theme.palette.common.black}`,
  },
  menuButton: {
    height: 24,
    minWidth: 93,
    fontSize: 10,
    lineHeight: '13px',
    fontWeight: 500,
  },
}), { name: 'PurchaserMenuButtons' } )

export const PurchaserMenuButtons = (props: PurchaserMenuButtonsProps) => {
  const {
    className,
    showPreview,
    onFileChange,
    onClickHidePreview,
    onClickShowPreview,
    ...otherProps
  } = props

  const t = (x: string) => x

  const classes = useStyles(props)

  return (
    <div
      className={classnames([
        classes.root,
        className,
      ])}
      {...otherProps}
    >
      {
        showPreview ?
          <BaseButton
            className={classes.menuButton}
            buttonVariant={'success'}
            onClick={onClickHidePreview}
          >
            {t('Close preview')}
          </BaseButton>
          :
          <>
            <FileInput
              buttonProps={{
                className: classnames([
                  classes.menuButton,
                  classes.menuButtonFile,
                ]),
              }}
              onChange={(e) => { onFileChange(e) }}
            >
              {t('Upload XLS')}
            </FileInput>
            <BaseButton
              className={classes.menuButton}
              buttonVariant={'success'}
              onClick={onClickShowPreview}
            >
              {t('Preview')}
            </BaseButton>
          </>
      }
    </div>
  )
}

export default PurchaserMenuButtons
