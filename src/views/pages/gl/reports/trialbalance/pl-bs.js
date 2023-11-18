import { Grid, Table, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'
import { amountWithComma, isAllowed, print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { grey } from '@mui/material/colors'
import { PL_BSColumns } from './static-data'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'

const setTotalRow = data => {
  const sumNet1 = data.reduce(function (prev, current) {
    return prev + +current.net1
  }, 0)

  const sumNet2 = data.reduce(function (prev, current) {
    return prev + +current.net1
  }, 0)

  const sumNet3 = data.reduce(function (prev, current) {
    return prev + +current.net1
  }, 0)

  const sumNet4 = data.reduce(function (prev, current) {
    return prev + +current.net1
  }, 0)

  return {
    net1: Math.round(sumNet1),
    net2: Math.round(sumNet2),
    net3: Math.round(sumNet3),
    net4: Math.round(sumNet4),
    rows: data.length
  }
}

const PLBSTab = ({ stateData, classification, pageTitle }) => {
  // ** Master States ** //
  const permissions = usePermission()

  const data = stateData.filter(i => i.classification === classification)

  const [states, setStates] = useState({ pageSize: 10 })
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const totalStates = setTotalRow(data)

  const exportDataList = data?.map(item => ({
    'A Code': item.acode,
    'A Name': item.aname,
    'Level 1': amountWithComma(item.net1) || 0,
    'Level 2': amountWithComma(item.net2) || 0,
    'Level 3': amountWithComma(item.net3) || 0
  }))

  const printFooter = [
    {
      field: 'Total',
      colspan: '2'
    },
    {
      field: amountWithComma(totalStates.net1),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.net2),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.net3),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.net4),
      align: 'right'
    }
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
                PL_BSColumns,
                value: searchStates.searchText,
                permissions: { C: false, E: isAllowed(permissions, 'E') }
              }
            }}
            autoHeight
            rowHeight={32}
            getRowId={row => row.acode}
            columns={PL_BSColumns}
            disableSelectionOnClick
          />

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: grey[100] }}>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.net1)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.net2)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.net3)}
                </TableCell>
                <TableCell width={130} align='right'>
                  {amountWithComma(totalStates.net4)}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </Grid>
    </>
  )
}

export default PLBSTab
