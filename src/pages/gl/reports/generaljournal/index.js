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
import { getLedger } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/gl/reports/generaljournal/static-data'
import { amountWithComma, dateconvert, escapeRegExp, handleSearch, isAllowed } from 'src/@core/utils'
import { print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { getAccountAPI, getVoucherTypeAPI } from 'src/configs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'

const pageTitle = 'General Journal'

const defaultValues = {
  vtype: null,
  vno: null,
  startdate: null,
  enddate: null,
  account: null,
  chqno: null
}

const setTotalRow = data => {
  const sumDR = data.reduce(function (prev, current) {
    return prev + +current.amtdr
  }, 0)

  const sumCR = data.reduce(function (prev, current) {
    return prev + +current.amtcr
  }, 0)

  return { amtdr: Math.round(sumDR), amtcr: Math.round(sumCR), rows: data.length }
}

const GeneralJournal = () => {
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

  const [states, setStates] = useState({ pageSize: 10, isLoading: false, data: [] })
  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [voucherTypeOptions, setVoucherTypeOptions] = useState([])
  const [accountOptions, setAccountOptions] = useState([])

  const [totalStates, setTotalStates] = useState({ amtdr: 0, amtcr: 0, rows: 0 })

  const initialized = async () => {
    //Bind Voucher Type List
    const voucherTypeResponse = await getVoucherTypeAPI()
    if (voucherTypeResponse?.error) {
      toast.error(voucherTypeResponse.error.message)

      return
    }

    const voucherTypeData = voucherTypeResponse?.data?.items.map(item => ({ value: item.vcode, label: item.vname }))
    setVoucherTypeOptions(voucherTypeData)

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
      enddate: dateconvert(data.enddate)
    }
    if (data?.vtype?.value) {
      params = { ...params, vcode: data?.vtype?.value }
    }
    if (data?.vno) {
      params = { ...params, vno: data?.vno }
    }
    if (data?.account?.value) {
      params = { ...params, acode: data?.account?.value }
    }
    if (data?.chqno) {
      params = { ...params, chqno: chqno?.vno }
    }

    // vno: data?.vno || null,
    // acode: data?.account?.value || null,
    // chqno: data?.chqno || null

    await getLedger(params)
      .then(response => {
        setStates({ ...states, isLoading: false, data: response?.items })
        setTotalStates(setTotalRow(response?.items))
        handleSearch({ value: searchStates.searchText, data: response?.items, setSearchStates })
      })
      .catch(() => {
        setStates({ ...states, isLoading: false })
      })
  }

  const exportDataList = states.data?.map(item => ({
    'V Code': item.vcode,
    'V Name': item.vname,
    'V No': item.vno,
    'V Date': dateconvert(item.vdate),
    'A Code': item.acode,
    'A Name': item.aname,
    Description: item.vdesc1,
    'Chque No': item.chqno || '',
    'Cheque Date': item.chqdate !== null ? dateconvert(item.chqdate) : '',
    Debit: amountWithComma(item.amtdr),
    Credit: amountWithComma(item.amtcr)
  }))

  const printFooter = [
    {
      field: 'Total',
      colspan: '8'
    },
    {
      field: amountWithComma(totalStates.amtdr),
      align: 'right'
    },
    {
      field: amountWithComma(totalStates.amtcr),
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
                  <Icon icon='tabler:refresh' /> Refresh
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3} p={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='vtype'
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <Autocomplete
                          size='small'
                          options={voucherTypeOptions}
                          value={field.value?.value ? field.value : null}
                          getOptionLabel={option => option.label}
                          onChange={(_, data) => field.onChange(data)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='VOUCHER TYPE'
                              placeholder='SELECT VOUCHER TYPE'
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
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <Controller
                    name='vno'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='VOUCHER NO.'
                        onChange={onChange}
                        placeholder='VOUCHER NO.'
                        size='small'
                        type='number'
                        onInput={e => {
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                        }}
                        inputProps={{ maxLength: 10 }}
                      />
                    )}
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size='small'>
                  <Controller
                    name='account'
                    control={control}
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
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <Controller
                    name='chqno'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='CHEQUE NO.'
                        onChange={onChange}
                        placeholder='CHEQUE NO.'
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <DataGrid
              sx={{ fontSize: 10 }}
              rows={states.data ?? []}
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
                  columns,
                  value: searchStates.searchText,
                  permissions: { C: false, E: isAllowed(permissions, 'E') }
                }
              }}
              autoHeight
              rowHeight={32}
              getRowId={row => `${row.vcode}${row.vno}${row.acode}`}
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
      </Card>
    </form>
  )
}

export default GeneralJournal
