import { Box, Button, Grid, Table, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'
import { amountWithComma, isAllowed, print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { grey } from '@mui/material/colors'
import { trialBalanceColumns } from './static-data'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'

const pageTitle = 'Account Transaction'

const setTotalRow = data => {
  const sumODR = data.reduce(function (prev, current) {
    return prev + +current.odr
  }, 0)

  const sumOCR = data.reduce(function (prev, current) {
    return prev + +current.ocr
  }, 0)

  const sumYTDDR = data.reduce(function (prev, current) {
    return prev + +current.ytddr
  }, 0)

  const sumYTDCR = data.reduce(function (prev, current) {
    return prev + +current.ytdcr
  }, 0)

  const sumCDR = data.reduce(function (prev, current) {
    return prev + +current.cdr
  }, 0)

  const sumCCR = data.reduce(function (prev, current) {
    return prev + +current.ccr
  }, 0)

  return {
    odr: Math.round(sumODR),
    ocr: Math.round(sumOCR),
    ytddr: Math.round(sumYTDDR),
    ytdcr: Math.round(sumYTDCR),
    cdr: Math.round(sumCDR),
    ccr: Math.round(sumCCR),
    rows: data.length
  }
}

const TrialBalanceTab = ({ stateData }) => {
  // ** Master States ** //
  // ** Master States ** //
  const permissions = usePermission()
  const data = stateData
  const [states, setStates] = useState({ pageSize: 10 })
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const totalStates = setTotalRow(data)

  const exportDataList = data?.map(item => ({
    'A Code': item.acode,
    'A Name': item.aname,
    ODR: amountWithComma(item.odr) || 0,
    OCR: amountWithComma(item.ocr) || 0,
    'YTD DR': amountWithComma(item.ytddr) || 0,
    'YTD CR': amountWithComma(item.ytdcr) || 0,
    'Closing DR': amountWithComma(item.cdr) || 0,
    'Closing CR': amountWithComma(item.ccr) || 0
  }))

  const printFooter = [
    {
      field: 'Total',
      colspan: '2'
    },
    { field: amountWithComma(totalStates.odr), align: 'right' },
    { field: amountWithComma(totalStates.ocr), align: 'right' },
    { field: amountWithComma(totalStates.ytddr), align: 'right' },
    { field: amountWithComma(totalStates.ytdcr), align: 'right' },
    { field: amountWithComma(totalStates.cdr), align: 'right' },
    { field: amountWithComma(totalStates.ccr), align: 'right' }
  ]

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataGrid
            sx={{ fontSize: 10 }}
            rows={data ?? []}
            pageSize={states.pageSize}
            rowsPerPageOptions={[10, 50, 100]}
            components={{ Toolbar: DataGridHeaderToolbar }}
            onPageSizeChange={newPageSize => setStates({ ...states, pageSize: newPageSize })}
            componentsProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                onChange: event => handleSearch({ value: event.target.value, data: states.data, setSearchStates }),
                onPrint: () =>
                  print({
                    title: pageTitle,
                    data: exportDataList,
                    footer: printFooter
                  }),

                //onRefresh: handleRefresh,
                showRefreshButton: false,
                clearSearch: () => handleSearch({ value: '', data: states.data, setSearchStates }),
                exportTitle: pageTitle,
                exportData: exportDataList,
                trialBalanceColumns,
                value: searchStates.searchText,
                permissions: { C: false, E: isAllowed(permissions, 'E') }
              }
            }}
            autoHeight
            rowHeight={32}
            getRowId={row => row.acode}
            columns={trialBalanceColumns}
            disableSelectionOnClick
          />
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: grey[100] }}>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.odr)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.ocr)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.ytddr)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.ytdcr)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.cdr)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.ccr)}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </Grid>
    </>
  )
}

export default TrialBalanceTab
