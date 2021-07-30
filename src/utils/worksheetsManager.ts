/* eslint-disable @typescript-eslint/member-ordering */
import GC from '@grapecity/spread-sheets'
import { Store, Unsubscribe } from '@reduxjs/toolkit'
import { loadJSONSelector } from '../state/excel.slice'
import { importFromExcel } from './importFromExcel'
import isEqual from 'lodash/isEqual'

import { ExcelImportedData } from './types'

export class WorksheetsManager {
  private workbookPurchaser?: GC.Spread.Sheets.Workbook
  private workbookSupplier?: GC.Spread.Sheets.Workbook
  private workbookVirtual?: GC.Spread.Sheets.Workbook
  private store: Store
  private storeUnSubscribeFn?: Unsubscribe
  private data: {
    loadedExcelContent?: ExcelImportedData | null,
  } = {}

  public constructor(props: {
    workbookPurchaser?: GC.Spread.Sheets.Workbook,
    workbookSupplier?: GC.Spread.Sheets.Workbook,
    workbookVirtual?: GC.Spread.Sheets.Workbook,
    store: Store,
  }) {
    this.workbookPurchaser = props.workbookPurchaser
    this.workbookSupplier = props.workbookSupplier
    this.workbookVirtual = props.workbookVirtual
    this.store = props.store

    this.storeListener()
    this.storeSubscribe()
  }

  // STORE

  private storeSubscribe() {
    this.storeUnSubscribeFn = this.store.subscribe(this.storeListener)
  }

  public storeUnSubscribe(){
    this.storeUnSubscribeFn?.()
  }

  private storeListener = () => {
    const state = this.store.getState()
    const excelContentsState = loadJSONSelector(state)

    if(!isEqual(excelContentsState.value, this.data.loadedExcelContent)){
      this.data.loadedExcelContent = excelContentsState.value
      localStorage.setItem('json3', JSON.stringify(this.data.loadedExcelContent))
      // @ts-ignore
      this.onLoadedExcelContentChanged(this.data.loadedExcelContent)
    }
  }

  private onLoadedExcelContentChanged(newContent: ExcelImportedData | null){
    if(!newContent) return null

    return this.loadJSONToWorkbookPurchaser(newContent)
  }

  // PURCHASER

  public async loadFileToWorkbookPurchaser(file: File){
    const data = await importFromExcel(file)
    localStorage.setItem('json1', JSON.stringify(data))
    return this.workbookPurchaser && this.fromJSON(this.workbookPurchaser, data)
  }

  public loadJSONToWorkbookPurchaser(data: ExcelImportedData){
    return this.workbookPurchaser && this.fromJSON(this.workbookPurchaser, data)
  }

  public getJSONFromWorkbookPurchaser(){
    return this.workbookPurchaser && this.toJSON(this.workbookPurchaser)
  }

  // SUPPLIER

  public loadJSONToWorkbookSupplier(data: ExcelImportedData){
    return this.workbookSupplier && this.fromJSON(this.workbookSupplier, data)
  }

  // PURCHASER <> SUPPLIER

  public copyDataFromWorkbookPurchaserToSupplier() {
    const data = this.getJSONFromWorkbookPurchaser()
    return data && this.loadJSONToWorkbookSupplier(data)
  }

  // HELPERS

  private toJSON(workbook: GC.Spread.Sheets.Workbook){
    return workbook.toJSON() as ExcelImportedData | undefined
  }

  private fromJSON(workbook: GC.Spread.Sheets.Workbook, data: ExcelImportedData){
    return workbook.fromJSON(data)
  }
}
