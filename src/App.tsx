import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react'
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-charts'
import '@grapecity/spread-sheets-pivot-addon'
import '@grapecity/spread-sheets-shapes'
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css'

import PurchaserMenuButtons from './components/organisms/PurchaserMenuButtons'
import ExcelPurchaserLayout from './components/templates/ExcelPurchaserLayout'

import { WorksheetsManager } from './utils/worksheetsManager'

import './index.css'

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  excelContainer: {
    width: '100%',
    height: '100%',
  },
}), { name: 'App' })

const App = () => {
  const classes = useStyles()

  const [showPreview, setShowPreview] = React.useState<boolean>(false)
  const [workbookPurchaser, setWorkbookPurchaser] = React.useState<GC.Spread.Sheets.Workbook>()
  const [workbookSupplier, setWorkbookSupplier] = React.useState<GC.Spread.Sheets.Workbook>()

  const worksheetsManager = React.useMemo(() => {
    // make instance when all the workbooks are initialized
    return workbookPurchaser && workbookSupplier && new WorksheetsManager({
      workbookPurchaser,
      workbookSupplier,
    })
  }, [workbookPurchaser, workbookSupplier])

  return (
    <ExcelPurchaserLayout
      className={classes.root}
      showPreview={showPreview}
      menuContent={
        <PurchaserMenuButtons
          showPreview={showPreview}
          onFileChange={(file) => {
            worksheetsManager?.loadFileToWorkbookPurchaser(file)
          }}
          onClickHidePreview={() => setShowPreview(false)}
          onClickShowPreview={() => {
            worksheetsManager?.copyDataFromWorkbookPurchaserToSupplier()
            setShowPreview(true)
          }}
        />
      }
      purchaserExcelContent={
        <SpreadSheets
          hostClass={classes.excelContainer}
          workbookInitialized={setWorkbookPurchaser}
        >
          <Worksheet></Worksheet>
        </SpreadSheets>
      }
      mappingsContent={null}
      supplierExcelContent={
        <SpreadSheets
          hostClass={classes.excelContainer}
          workbookInitialized={setWorkbookSupplier}
        >
          <Worksheet></Worksheet>
        </SpreadSheets>
      }
    />
  )
}

export default App
