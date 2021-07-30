import { ExcelImportedData } from '../utils/types'

export const saveJSON = (data: ExcelImportedData) => {
  return localStorage.setItem('json', JSON.stringify(data))
}
