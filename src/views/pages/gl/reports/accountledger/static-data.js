import { amountWithComma, dateconvert } from 'src/@core/utils'

export const columns = [
  { minWidth: 130, headerName: 'V Date', field: 'vdate', renderCell: ({ row }) => dateconvert(row.vdate) },
  { minWidth: 100, headerName: 'V Type', field: 'vcode' },
  { minWidth: 80, headerName: 'V No', field: 'vno' },
  { minWidth: 250, headerName: 'Description', field: 'vdesc1' },
  { minWidth: 100, headerName: 'Chq. No', field: 'chqno' },
  { minWidth: 130, headerName: 'Chq. Date', field: 'chqdate', renderCell: ({ row }) => dateconvert(row.chqdate) || '' },
  { minWidth: 250, headerName: 'Detail Description', field: 'vdesc' },
  {
    minWidth: 100,
    headerName: 'Debit',
    field: 'amtdr',
    renderCell: ({ row }) => amountWithComma(row.amtdr || 0),
    type: 'number'
  },
  {
    minWidth: 100,
    headerName: 'Credit',
    field: 'amtcr',
    renderCell: ({ row }) => amountWithComma(row.amtcr || 0),
    type: 'number'
  },
  {
    minWidth: 100,
    headerName: 'Balance',
    field: 'balance',
    renderCell: ({ row }) => amountWithComma(row.balance || 0),
    type: 'number'
  }
]
