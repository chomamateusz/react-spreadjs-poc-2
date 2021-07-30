import * as Excel from '@grapecity/spread-excelio'

import { ExcelImportedData, ExcelImportError } from './types'

const excelIO = new Excel.IO()

export const importFromExcel = (file: File): Promise<ExcelImportedData> => {
  return new Promise((resolve, reject) => {
    excelIO.open(
      file,
      (data: ExcelImportedData) => {
        resolve(data)
      },
      (error: ExcelImportError) => reject(error)
    )
  })
}
