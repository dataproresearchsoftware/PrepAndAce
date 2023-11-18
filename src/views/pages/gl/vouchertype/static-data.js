export const typeOptions = [
  { value: 'P', label: 'Payment' },
  { value: 'R', label: 'Receipt' },
  { value: 'O', label: 'Other' }
]

export const modeOptions = [
  { value: 'C', label: 'Cash' },
  { value: 'B', label: 'Bank' },
  { value: 'O', label: 'Other' }
]

export const columns = [
  { minWidth: 100, headerName: 'Code', field: 'vcode' },
  { minWidth: 250, headerName: 'Name', field: 'vname' },
  { minWidth: 130, headerName: 'Type', field: 'vtype', renderCell: ({ row }) => row.vtypename },
  { minWidth: 130, headerName: 'Mode', field: 'vmode', renderCell: ({ row }) => row.vmodename }
]
