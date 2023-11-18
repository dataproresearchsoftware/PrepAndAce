export const columns = [
  { minWidth: 150, headerName: 'L1 Code', field: 'l1code', renderCell: ({ row }) => row.l1name },
  { minWidth: 300, headerName: 'L2 Code', field: 'l2code', renderCell: ({ row }) => row.l2name },
  { minWidth: 150, headerName: 'A Code', field: 'acode' },
  { minWidth: 300, headerName: 'A Name', field: 'aname' },
  { minWidth: 100, headerName: 'Odr', field: 'odr' },
  { minWidth: 100, headerName: 'Ocr', field: 'ocr' }
]
