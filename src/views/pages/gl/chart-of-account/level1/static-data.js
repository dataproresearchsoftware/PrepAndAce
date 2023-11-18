export const typeOptions = [
  { value: 'A', label: 'Assets' },
  { value: 'L', label: 'Liabilities' },
  { value: 'P', label: 'Proprietorship' },
  { value: 'E', label: 'Expenses' },
  { value: 'R', label: 'Revenue' }
]

export const classificationOptions = [
  {
    title: 'Profit & Loss',
    id: 'chkclassification1',
    value: 'P',
    label: 'PL'
  },
  {
    title: 'Balance Sheet',
    id: 'chkclassification2',
    value: 'B',
    label: 'BS'
  }
]

export const columns = [
  { minWidth: 80, headerName: 'L1 Code', field: 'l1code' },
  { minWidth: 200, headerName: 'L1 Name', field: 'l1name' },
  {
    minWidth: 250,
    headerName: 'CLASSIFICATION',
    field: 'classification',
    renderCell: ({ row }) => row.classification1
  },
  { minWidth: 150, headerName: 'TYPE', field: 'type', renderCell: ({ row }) => row.type1 }
]
