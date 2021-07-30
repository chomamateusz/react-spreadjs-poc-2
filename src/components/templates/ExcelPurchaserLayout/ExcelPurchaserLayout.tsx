import React from 'react'
import classnames from 'classnames'

import { makeStyles, Theme } from '@material-ui/core'

export interface ExcelPurchaserLayoutProps extends React.HTMLProps<HTMLDivElement> {
  showPreview: boolean,
  menuContent: React.ReactNode,
  purchaserExcelContent: React.ReactNode,
  mappingsContent: React.ReactNode,
  supplierExcelContent: React.ReactNode,
}

const useStyles = makeStyles<Theme, ExcelPurchaserLayoutProps>((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    position: 'relative',
    flexGrow: 1,
  },
  mainview: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: ({ showPreview }) => showPreview ? 0 : 1,
    display: 'flex',
    backgroundColor: theme.palette.common.white,
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: ({ showPreview }) => showPreview ? 1 : 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.common.white,
  },
  menuContent: {
    width: '100%',
    height: 37,
    backgroundColor: theme.palette.grey[300],
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  purchaserExcelContent: {
    padding: theme.spacing(2),
    flexBasis: 'calc(100% - 288px)',
  },
  mappingsContent: {
    flexBasis: 288,
    height: '100%',
  },
  supplierExcelContent: {
    padding: theme.spacing(2),
    flexBasis: '100%',
  },
}), { name: 'ExcelPurchaserLayout' } )

export const ExcelPurchaserLayout = (props: ExcelPurchaserLayoutProps) => {
  const {
    className,
    menuContent,
    purchaserExcelContent,
    mappingsContent,
    supplierExcelContent,
    ...otherProps
  } = props

  const classes = useStyles(props)

  return (
    <div
      className={classnames([
        classes.root,
        className,
      ])}
      {...otherProps}
    >
      <div
        className={classes.menuContent}
      >
        {menuContent}
      </div>
      <div
        className={classes.main}
      >
        <div
          className={classes.mainview}
        >
          <div
            className={classes.purchaserExcelContent}
          >
            {purchaserExcelContent}
          </div>
          <div
            className={classes.mappingsContent}
          >
            {mappingsContent}
          </div>
        </div>
        <div
          className={classes.preview}
        >
          <div
            className={classes.supplierExcelContent}
          >
            {supplierExcelContent}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExcelPurchaserLayout
