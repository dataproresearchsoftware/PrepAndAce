import { Chip } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { dateconvert } from 'src/@core/utils'

export const columns = [
  { flex: 1, minWidth: 100, headerName: 'ITEM TYPE', field: 'itype' },
  { flex: 1, minWidth: 100, headerName: 'TYPE NAME', field: 'itname' },
  {
    minWidth: 120,
    align: 'center',
    headerName: 'Status',
    field: 'status',
    renderCell: ({ row }) => (
      <Chip
        size='small'
        sx={{
          width: 80,
          backgroundColor: row.status === 'Active' ? green[100] : red[100],
          color: row.status === 'Active' ? green[500] : red[500]
        }}
        label={row.status}
        variant='filled'
      />
    )
  },
  { minWidth: 150, headerName: 'STATUS DATE', field: 'status_dt', renderCell: ({ row }) => dateconvert(row.status_dt) }
]
