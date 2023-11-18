import { amountWithComma, dateconvert } from 'src/@core/utils'

export const trialBalanceColumns = [
  {
    minWidth: 150,
    headerName: 'Acct. Code',
    field: 'acode',
    renderCell: ({ row }) => row.acode
  },
  {
    minWidth: 350,
    flex: 1,
    headerName: 'Acct. Name',
    field: 'aname',
    renderCell: ({ row }) => row.aname
  },
  {
    minWidth: 130,
    headerName: 'Opening DR',
    field: 'odr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.odr)
  },
  {
    minWidth: 130,
    headerName: 'Opening CR',
    field: 'ocr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.ocr)
  },
  {
    minWidth: 130,
    headerName: 'YTD DR',
    field: 'ytddr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.ytddr)
  },
  {
    minWidth: 130,
    headerName: 'YTD CR',
    field: 'ytdcr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.ytdcr)
  },
  {
    minWidth: 130,
    headerName: 'Closing DR',
    field: 'cdr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.cdr)
  },
  {
    minWidth: 130,
    headerName: 'Closing CR',
    field: 'ccr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.ccr)
  }
]

export const PL_BSColumns = [
  {
    minWidth: 150,
    headerName: 'Acct. Code',
    field: 'acode',
    renderCell: ({ row }) => row.acode
  },
  {
    minWidth: 350,
    flex: 1,
    headerName: 'Acct. Name',
    field: 'aname',
    renderCell: ({ row }) => row.aname
  },
  {
    minWidth: 130,
    headerName: 'Level 1',
    field: 'net1',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.net1)
  },

  {
    minWidth: 130,
    headerName: 'Level 2',
    field: 'net2',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.net2)
  },
  {
    minWidth: 130,
    headerName: 'Level 3',
    field: 'net3',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.net3)
  }
]
