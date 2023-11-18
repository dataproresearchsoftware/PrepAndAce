import { Chip, TableCell, TableRow } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { amountWithComma, dateconvert } from 'src/@core/utils'

export const isCashOptions = [
  {
    title: 'CASH',
    id: 'iscash1',
    value: 'Y',
    label: 'CASH'
  },
  {
    title: 'CREDIT',
    id: 'iscash2',
    value: 'N',
    label: 'CREDIT'
  }
]

export const columns = [
  { minWidth: 80, headerName: 'VNo', field: 'vno' },
  { minWidth: 130, headerName: 'V Date', field: 'vdate', renderCell: ({ row }) => dateconvert(row.vdate) },
  { minWidth: 200, headerName: 'Sup_name', field: 'sup_name' },
  {
    minWidth: 120,
    headerName: 'Status',
    field: 'post',
    align: 'center',
    renderCell: ({ row }) => (
      <Chip
        size='small'
        sx={{
          width: 80,
          backgroundColor: row.post === 'Y' ? green[100] : red[100],
          color: row.post === 'Y' ? green[500] : red[500]
        }}
        label={row.post === 'Y' ? 'Posted' : 'Unposted'}
        variant='filled'
      />
    )
  },
  {
    minWidth: 100,
    headerName: 'Discount',
    field: 'disc_amt',
    renderCell: ({ row }) => amountWithComma(row.ptran.disc_amt || 0),
    type: 'number'
  },
  {
    minWidth: 100,
    headerName: 'Amount',
    field: 'amount',
    renderCell: ({ row }) => amountWithComma(row.ptran.amount || 0),
    type: 'number'
  }
]

export const detailColumns = [
  { minWidth: 100, headerName: 'S.No', field: 'sno' },
  {
    minWidth: 300,
    headerName: 'Item',
    field: 'icode',
    renderCell: ({ row }) => `${row.icode} ${row.iname}`
  },
  {
    minWidth: 130,
    headerName: 'Rate',
    field: 'rate',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.rate || 0),
    type: 'number'
  },
  { minWidth: 100, headerName: 'Quantity', field: 'qty', align: 'center' },
  { minWidth: 130, headerName: 'Disc. %', field: 'disc_per', align: 'right', type: 'number' },
  {
    minWidth: 130,
    headerName: 'Disc. Amt',
    field: 'disc_amt',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.disc_amt || 0),
    type: 'number'
  },
  {
    minWidth: 150,
    headerName: 'Amount',
    field: 'amount',
    align: 'right',
    renderCell: ({ row }) => amountWithComma(row.amount || 0),
    type: 'number'
  }
]
