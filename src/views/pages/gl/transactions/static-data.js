import { Chip, TableCell, TableRow } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { amountWithComma, dateconvert } from 'src/@core/utils'

export const columns = [
  { minWidth: 80, headerName: 'V Code', field: 'vcode' },
  { minWidth: 150, headerName: 'V Name', field: 'vname' },
  { minWidth: 80, headerName: 'VNo', field: 'vno' },
  { minWidth: 130, headerName: 'V Date', field: 'vdate', renderCell: ({ row }) => dateconvert(row.vdate) },
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
  { minWidth: 100, headerName: 'Description', field: 'vdesc1' },
  {
    minWidth: 100,
    headerName: 'Debit',
    field: 'amountdr',
    renderCell: ({ row }) => amountWithComma(row.amountdr),
    type: 'number'
  },
  {
    minWidth: 100,
    headerName: 'Credit',
    field: 'amountcr',
    renderCell: ({ row }) => amountWithComma(row.amountcr),
    type: 'number'
  }
]

// sno: '',
// account: { value: '', label: '' },
// vdesc: '',
// chqno: '',
// chqdate: '',
// ref_no: '',
// amountdr: 0,
// amountcr: 0
export const detailColumns = [
  { minWidth: 80, headerName: 'sno', field: 'sno' },
  {
    minWidth: 200,
    headerName: 'account',
    field: 'account',
    renderCell: ({ row }) => row.aname
  },
  { minWidth: 200, headerName: 'Description', field: 'vdesc' },
  { minWidth: 130, headerName: 'Cheque No', field: 'chqno' },
  {
    minWidth: 150,
    headerName: 'Cheque Date',
    field: 'chqdate',
    renderCell: ({ row }) => dateconvert(row.chqdate)
  },
  { minWidth: 100, headerName: 'Ref. No', field: 'ref_no' },
  {
    minWidth: 100,
    headerName: 'Debit',
    field: 'amountdr',
    renderCell: ({ row }) => amountWithComma(row.amountdr),
    type: 'number'
  },
  {
    minWidth: 100,
    headerName: 'Credit',
    field: 'amountcr',
    renderCell: ({ row }) => amountWithComma(row.amountcr),
    type: 'number'
  }
]
