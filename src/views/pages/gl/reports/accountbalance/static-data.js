import { amountWithComma, dateconvert } from 'src/@core/utils'

export const accountBalanceColumns = [
  {
    minWidth: 100,
    align: 'center',
    headerName: 'Month',
    field: 'month'
  },
  {
    minWidth: 100,
    align: 'right',
    amountWithComma: true,
    headerName: 'Debit',
    field: 'dramt'
  },
  {
    minWidth: 100,
    align: 'right',
    amountWithComma: true,
    headerName: 'Credit',
    field: 'cramt'
  }
]

export const accountTransactionColumns = [
  {
    minWidth: 150,
    headerName: 'Voucher Date',
    field: 'vdate',
    renderCell: ({ row }) => dateconvert(row.vdate)
  },
  {
    minWidth: 150,
    headerName: 'Voucher Type',
    field: 'vcode'
  },
  {
    minWidth: 100,
    headerName: 'VNo',
    field: 'vno'
  },
  {
    minWidth: 300,
    headerName: 'Description',
    field: 'vdesc1'
  },
  {
    minWidth: 100,
    headerName: 'Cheque No',
    field: 'chqno'
  },
  {
    minWidth: 150,
    headerName: 'Cheque Date',
    field: 'chqdate',
    renderCell: ({ row }) => dateconvert(row.chqdate)
  },
  {
    minWidth: 100,
    headerName: 'Desc',
    field: 'vdesc'
  },
  {
    minWidth: 100,
    headerName: 'Debit',
    align: 'right',
    field: 'amtdr',
    renderCell: ({ row }) => amountWithComma(row.amtdr)
  },
  {
    minWidth: 100,
    headerName: 'Credit',
    field: 'amtcr',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.amtcr)
  }
]
