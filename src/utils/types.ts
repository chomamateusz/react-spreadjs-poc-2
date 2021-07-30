
export interface ExcelImportedData {
  [key: string]: unknown,
}

export interface ExcelImportError {
  errorCode: number,
  errorMessage: string,
}
