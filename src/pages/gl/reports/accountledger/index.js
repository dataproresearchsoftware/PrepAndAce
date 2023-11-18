import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardHeader,
  Box,
  IconButton,
  Button,
  Grid,
  Alert,
  Tooltip,
  TextField,
  FormControl,
  Divider,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { getAccountLedger, getLedger } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/gl/reports/accountledger/static-data'
import { amountWithComma, dateconvert, escapeRegExp, handleSearch, isAllowed } from 'src/@core/utils'
import { print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { getAccountAPI, getVoucherTypeAPI } from 'src/configs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'

const pageTitle = 'Account Ledger'

const defaultValues = {
  account: null,
  startdate: null,
  enddate: null
}

const setTotalRow = data => {
  const sumDR = data.reduce(function (prev, current) {
    return prev + +current.amtdr
  }, 0)

  const sumCR = data.reduce(function (prev, current) {
    return prev + +current.amtcr
  }, 0)

  return {
    amtdr: Math.round(sumDR),
    amtcr: Math.round(sumCR),
    balance: Math.round(sumDR) - Math.round(sumCR),
    rows: data.length
  }
}

const AccountLedger = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    resetField,
    formState: { errors }
  } = useForm({ defaultValues })

  const [states, setStates] = useState({
    pageSize: 10,
    isLoading: false,
    accountLedgerData: [],
    ledgerData: []
  })
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [accountOptions, setAccountOptions] = useState([])

  const [totalStates, setTotalStates] = useState({ amtdr: 0, amtcr: 0, rows: 0, opening: 0 })

  const initialized = async () => {
    //Bind Account List
    const accountResponse = await getAccountAPI()
    if (accountResponse?.error) {
      toast.error(accountResponse.error.message)

      return
    }

    const accountData = accountResponse.data.items.map(item => ({
      value: item.acode,
      label: `${item.aname} ${item.acode}`
    }))
    setAccountOptions(accountData)
  }

  useEffect(() => {
    initialized()
  }, [])

  const handleRefresh = () => {
    reset()
    setSearchStates({ searchText: '', filteredData: [] })
    setStates({ pageSize: 10, isLoading: false, data: [] })
  }

  const onSubmit = async data => {
    setStates({ ...states, isLoading: true })

    let params = {
      startdate: dateconvert(data.startdate),
      enddate: dateconvert(data.enddate),
      acode: data?.account?.value
    }

    await getAccountLedger(params)
      .then(response => {
        setStates({
          ...states,
          isLoading: false,
          accountLedgerData: response.accountLedgerData,
          ledgerData: response.ledgerData
        })
        setTotalStates({
          ...setTotalRow(response.ledgerData),
          opening: Math.round(response.accountLedgerData.odr - response.accountLedgerData.ocr)
        })
        handleSearch({ value: searchStates.searchText, data: response.ledgerData, setSearchStates })
      })
      .catch(() => {
        setStates({ ...states, isLoading: false })
      })
  }

  let exportDataList = states.ledgerData?.map(item => ({
    'V Date': dateconvert(item.vdate),
    'V Code': item.vcode,
    'V Name': item.vname,
    'V No': item.vno,
    Description: item.vdesc1 || '',
    'Chque No': item.chqno || '',
    'Cheque Date': item.chqdate !== null ? dateconvert(item.chqdate) : '',
    'Detail Description': item.vdesc2 || '',
    Debit: amountWithComma(item.amtdr),
    Credit: amountWithComma(item.amtcr),
    Balance: amountWithComma(item.balance)
  }))

  const printFooter = [
    {
      field: 'Total',
      colspan: '8'
    },
    {
      field: amountWithComma(totalStates.amtdr || 0),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.amtcr || 0),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.balance || 0),
      align: 'right'
    }
  ]

  const printHeader = [
    {
      field: '',
      colspan: '9'
    },
    {
      field: 'Opening:',
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.opening || 0),
      align: 'right'
    }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardHeader title={pageTitle} />
              </Grid>
              <Grid item xs={12} md={6} display='flex' justifyContent='right' alignItems='center'>
                <LoadingButton
                  loading={states.isLoading}
                  size='medium'
                  type='submit'
                  sx={{ mr: 1 }}
                  variant='contained'
                >
                  <Icon icon='tabler:search' /> Search
                </LoadingButton>
                <Button
                  loading={states.isLoading}
                  size='medium'
                  onClick={handleRefresh}
                  sx={{ mr: 5 }}
                  variant='outlined'
                >
                  <Icon icon='tabler:refresh' /> Reset
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3} p={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='account'
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          size='small'
                          options={accountOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='ACCOUNT'
                              placeholder='SELECT ACCOUNT'
                              variant='outlined'
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <Controller
                    name='startdate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <DatePickerWrapper>
                          <ReactDatePicker
                            selected={value}
                            isClearable
                            showMonthDropdown
                            showYearDropdown
                            dateFormat='dd-MMM-yyyy'
                            maxDate={watch('enddate')}
                            popperPlacement='auto'
                            onChange={onChange}
                            placeholderText='SELECT DATE'
                            customInput={
                              <TextField
                                fullWidth
                                label='VOUCHER START DATE'
                                placeholder='SELECT DATE '
                                size='small'
                                error={Boolean(errors.startdate)}
                                helperText={Boolean(errors.startdate) && 'Required'}
                              />
                            }
                          />
                        </DatePickerWrapper>
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <Controller
                    name='enddate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <DatePickerWrapper>
                          <ReactDatePicker
                            selected={value}
                            isClearable
                            showMonthDropdown
                            showYearDropdown
                            dateFormat='dd-MMM-yyyy'
                            minDate={watch('startdate')}
                            popperPlacement='auto'
                            onChange={onChange}
                            placeholderText='SELECT DATE'
                            customInput={
                              <TextField
                                fullWidth
                                label='VOUCHER END DATE'
                                placeholder='SELECT DATE '
                                size='small'
                                error={Boolean(errors.enddate)}
                                helperText={Boolean(errors.enddate) && 'Required'}
                              />
                            }
                          />
                        </DatePickerWrapper>
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} display='flex' justifyContent='end'>
                <TextField
                  id='post'
                  value={amountWithComma(totalStates.opening || 0)}
                  label='Opening'
                  sx={{ maxWidth: 200 }}
                  inputProps={{ style: { textAlign: 'right', fontWeight: 'bold' } }}
                  color='primary'
                  focused
                  variant='outlined'
                  placeholder='Opening'
                  size='small'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <DataGrid
              sx={{ fontSize: 10 }}
              rows={states.ledgerData ?? []}
              pageSize={states.pageSize}
              rowsPerPageOptions={[10, 50, 100]}
              components={{ Toolbar: DataGridHeaderToolbar }}
              onPageSizeChange={newPageSize => setStates({ ...states, pageSize: newPageSize })}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  onChange: event =>
                    handleSearch({ value: event.target.value, data: states.ledgerData, setSearchStates }),
                  onPrint: () =>
                    print({
                      title: pageTitle,
                      data: exportDataList,
                      columns,
                      header: printHeader,
                      footer: printFooter
                    }),

                  //onRefresh: handleRefresh,
                  showRefreshButton: false,
                  clearSearch: () => handleSearch({ value: '', data: states.ledgerData, setSearchStates }),
                  exportTitle: pageTitle,
                  exportData: exportDataList,
                  columns,
                  value: searchStates.searchText,
                  permissions: { C: false, E: isAllowed(permissions, 'E') }
                }
              }}
              autoHeight
              rowHeight={32}
              getRowId={row => `${row.vcode}${row.vno}${row.sno}`}
              columns={columns}
              disableSelectionOnClick
            />
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: grey[100] }}>
                  <TableCell colSpan={8} width={1170}>
                    Total
                  </TableCell>
                  <TableCell width={100} align='right'>
                    {amountWithComma(totalStates.amtdr || 0)}
                  </TableCell>
                  <TableCell width={100} align='right'>
                    {amountWithComma(totalStates.amtcr || 0)}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
        </Grid>
      </Card>
    </form>
  )
}

export default AccountLedger
