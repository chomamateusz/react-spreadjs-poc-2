/* eslint-disable @typescript-eslint/member-ordering */
import GC from '@grapecity/spread-sheets'
import { importFromExcel } from './importFromExcel'

import { ExcelImportedData } from './types'

export class WorksheetsManager {
  private workbookPurchaser?: GC.Spread.Sheets.Workbook
  private workbookSupplier?: GC.Spread.Sheets.Workbook
  private workbookVirtual?: GC.Spread.Sheets.Workbook

  public constructor(props: {
    workbookPurchaser?: GC.Spread.Sheets.Workbook,
    workbookSupplier?: GC.Spread.Sheets.Workbook,
    workbookVirtual?: GC.Spread.Sheets.Workbook,
  }) {
    this.workbookPurchaser = props.workbookPurchaser
    this.workbookSupplier = props.workbookSupplier
    this.workbookVirtual = props.workbookVirtual
  }

  // PURCHASER

  public async loadFileToWorkbookPurchaser(file: File){
    const data = await importFromExcel(file)
    localStorage.setItem('json1', JSON.stringify(data))
    return this.workbookPurchaser?.fromJSON(data)
  }

  public loadJSONToWorkbookPurchaser(data: ExcelImportedData){
    return this.workbookPurchaser?.fromJSON(data)
  }

  public getJSONFromWorkbookPurchaser(){
    return this.workbookPurchaser?.toJSON() as ExcelImportedData | undefined
  }

  // SUPPLIER

  public loadJSONToWorkbookSupplier(data: ExcelImportedData){
    return this.workbookSupplier?.fromJSON(data)
  }

  // PURCHASER <> SUPPLIER

  public copyDataFromWorkbookPurchaserToSupplier() {
    const data = this.getJSONFromWorkbookPurchaser()
    return data && this.loadJSONToWorkbookSupplier(data)
  }
}
