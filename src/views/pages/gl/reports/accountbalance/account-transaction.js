import {
  Box,
  Button,
  Card,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { amountWithComma, dateconvert, isAllowed, print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { grey } from '@mui/material/colors'
import { accountTransactionColumns } from './static-data'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import * as XLSX from 'xlsx'

const pageTitle = 'Account Transaction'

const setTotalRow = data => {
  const sumDR = data.reduce(function (prev, current) {
    return prev + +current.amtdr
  }, 0)

  const sumCR = data.reduce(function (prev, current) {
    return prev + +current.amtcr
  }, 0)

  return { amtdr: Math.round(sumDR), amtcr: Math.round(sumCR), rows: data.length }
}

const AccountTransactionTab = ({ states, setStates }) => {
  // ** Master States ** //
  const permissions = usePermission()

  const { accountTransaction, pageSize } = states.data
  const totalStates = setTotalRow(accountTransaction)

  const handleExport = () => {
    const exportDataList = accountTransaction?.map(item => ({
      'Voucher Date': dateconvert(item.vdate),
      'Voucher Code': item.vcode,
      'Voucher Name': item.vname,
      'Voucher No': item.vno,
      Description: item.vdesc1 || '',
      'Cheque No': item.chqno || '',
      'Cheque Date': dateconvert(item.chqdate) || '',
      'Detail Description': item.vdesc2 || '',
      Debit: amountWithComma(item.amtdr),
      Credit: amountWithComma(item.amtcr)
    }))
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportDataList)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${pageTitle}.xlsx`)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Grid container spacing={3} p={5}>
        <Grid item xs={12} sx={{ p: 5 }}>
          <Box>
            {/* {permissions.E && ( */}
            <Grid item md={6} xs={12}>
              <div>
                <Button
                  sx={{ ml: 2, mb: 2, gap: 2, height: 38 }}
                  variant='outlined'
                  color='primary'
                  size='medium'
                  onClick={() => handleExport()}
                  startIcon={<Icon icon='tabler:download' />}
                >
                  Export
                </Button>
              </div>
            </Grid>
            {/* )} */}
          </Box>

          <DataGrid
            rows={accountTransaction ?? []}
            pageSize={states.pageSize}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageSizeChange={newPageSize => setStates({ ...states, pageSize: newPageSize })}
            componentsProps={{
              baseButton: {
                variant: 'outlined'
              }
            }}
            autoHeight
            rowHeight={32}
            getRowId={row => `${row.vcode}-${row.vno}-${row.sno}-${row.acode}`}
            columns={accountTransactionColumns}
            disableSelectionOnClick
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell width={100} align='right'>
                  {amountWithComma(totalStates.amtdr)}
                </TableCell>
                <TableCell width={100} align='right'>
                  {amountWithComma(totalStates.amtcr)}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </Grid>
    </>
  )
}

export default AccountTransactionTab
