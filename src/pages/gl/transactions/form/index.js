import { useState, useEffect } from 'react'
import Spinner from 'src/@core/components/spinner'

import {
  Card,
  CardHeader,
  Box,
  IconButton,
  Grid,
  Tooltip,
  Autocomplete,
  TextField,
  Button,
  Chip,
  ButtonGroup,
  Typography,
  Divider
} from '@mui/material'
import Link from 'next/link'

import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { getGLTransactions, updateGLTransactions, deleteGLTransactions, getVoucherType, getAccount } from 'src/store'
import { toast } from 'react-hot-toast'
import { TransactionDetailRow, columns, detailColumns } from 'src/views/pages/gl/transactions/static-data'
import { dateconvert, isAllowed, setRedirectUrl } from 'src/@core/utils'
import { print } from '../print'
import usePermission from 'src/@core/hooks/usePermission'
import DeleteModal from 'src/views/components/modal/delete-modal'
import { LoadingButton } from '@mui/lab'
import { getAccountAPI, getVoucherTypeAPI } from 'src/configs'
import { useRouter } from 'next/router'
import ReactDatePicker from 'react-datepicker'
import CustomInput from 'src/views/components/date-picker/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { green, grey, red } from '@mui/material/colors'

const pageTitle = 'GL Transaction'
const errorMessage = 'Required!'

const TransactionsForm = () => {
  const permissions = usePermission()
  const { push, asPath, query } = useRouter()
  const { vcode, vno } = query

  const [states, setStates] = useState({
    isFind: false,
    isEdit: false,
    isSubmit: false,
    isLoading: true,
    isOpenModal: false,
    isError: false,
    isDetailError: false,
    customMessage: ''
  })

  const [voucherTypeOptions, setVouchderTypeOptions] = useState([])
  const [accountOptions, setAccountOptions] = useState([])

  const [transactionMaster, setTransactionMaster] = useState({
    vtype: null,
    vno: '',
    vdate: new Date(),
    vdesc1: '',
    post: 'N'
  })

  const [transactionDetail, setTransactionDetail] = useState([])
  const [transactionTotal, setTransactionTotal] = useState({ dr: 0, cr: 0, rows: 0 })

  const [accountDetail, setAccountDetail] = useState({
    chqno: '',
    chqdate: null,
    sno: '',
    account: null,
    vdesc: '',
    ref_no: '',
    amountdr: 0,
    amountcr: 0
  })
  const [deleteStates, setDeleteStates] = useState({})

  const initialized = async () => {
    const voucherTypeResponse = await getVoucherTypeAPI()
    if (voucherTypeResponse?.error) {
      toast.error(voucherTypeResponse.error.message)

      return
    }
    const voucherTypeData = voucherTypeResponse.data.items
    setVouchderTypeOptions(voucherTypeData.map(item => ({ value: item.vcode, label: `${item.vcode}-${item.vname}` })))

    //Bind Account List
    const accountResponse = await getAccountAPI()
    if (accountResponse?.error) {
      toast.error(accountResponse.error.message)

      return
    }
    const accountData = accountResponse.data.items
    setAccountOptions(accountData.map(item => ({ value: item.acode, label: `${item.aname} ${item.acode}` })))
    if (vcode && vno) {
      findTransaction({ vcode, vno })
    } else {
      setStates({ ...states, isLoading: false })
    }
  }

  useEffect(() => {
    initialized()
  }, [vcode, vno])

  const findTransaction = async ({ vcode, vno }) => {
    const voucherTypeResponse = await getVoucherTypeAPI()
    const voucherTypeData = voucherTypeResponse.data.items
    setStates({ ...states, isLoading: true })
    await getGLTransactions({ vcode, vno })
      .then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }
        const responseData = response.items
        const row = responseData[0]
        const vtype = voucherTypeData.find(item => item.vcode === row.vcode)

        const master = {
          vtype: {
            value: row.vcode,
            label: vtype.vname
          },
          vno: row.vno,
          vdate: new Date(row.vdate),
          vdesc1: row.vdesc1,
          post: row.post
        }

        const detail = responseData.map(item => ({
          sno: item.sno,
          acode: item.acode,
          aname: item.aname,
          vdesc: item.vdesc,
          chqno: item.chqno,
          chqdate: item.chqdate !== null ? dateconvert(item.chqdate) : '',
          ref_no: item.ref_no,
          amountdr: item.amountdr,
          amountcr: item.amountcr
        }))

        setTransactionMaster(master)
        setTransactionDetail(detail)
        setTransactionDetailTotal(detail)
        setStates({ ...states, isLoading: false, isFind: false })
      })
      .catch(() => {
        setStates({ ...states, isLoading: false, isFind: false })
      })
  }

  const resetAccountDetail = () => {
    setAccountDetail({
      chqno: '',
      chqdate: null,
      sno: '',
      account: null,
      vdesc: '',
      ref_no: '',
      amountdr: 0,
      amountcr: 0
    })
  }

  const resetTransactionDetail = () => {
    setTransactionDetail([])
    setTransactionTotal({ dr: 0, cr: 0, rows: 0 })
  }

  const setTransactionDetailTotal = data => {
    const sumDR = data.reduce(function (prev, current) {
      return prev + +current.amountdr
    }, 0)

    const sumCR = data.reduce(function (prev, current) {
      return prev + +current.amountcr
    }, 0)
    setTransactionTotal({ dr: sumDR, cr: sumCR, rows: data.length })
  }

  const handleAdd = () => {
    if (accountDetail.account === null) {
      setStates({ ...states, isDetailError: true })
    }
    if (accountDetail.amountdr === 0 && accountDetail.amountcr === 0) {
      setStates({ ...states, isDetailError: true })
    }
    if (accountDetail.account !== null && (accountDetail.amountdr > 0 || accountDetail.amountcr > 0)) {
      if (states.isEdit) {
        const editedDetail = transactionDetail.map(obj => {
          // 👇️ if id equals 2, update country property
          if (obj.sno === accountDetail.sno) {
            return {
              ...obj,
              sno: accountDetail.sno,
              account: { value: accountDetail.acode, label: accountDetail.aname },
              chqno: accountDetail.chqno,
              chqdate: accountDetail.chqdate !== null ? dateconvert(accountDetail.chqdate) : '',
              ref_no: accountDetail.ref_no,
              vdesc: accountDetail.vdesc,
              amountdr: accountDetail.amountdr,
              amountcr: accountDetail.amountcr
            }
          }

          // 👇️ otherwise return object as is
          return obj
        })

        setTransactionDetail(editedDetail)
        setTransactionDetailTotal(editedDetail)
        setStates({ ...states, customMessage: '', isDetailError: false, isEdit: false })
      } else {
        const sno = transactionDetail.length + 1

        const data = [
          ...transactionDetail,
          {
            sno,
            acode: accountDetail.account.value,
            aname: accountDetail.account.label,
            vdesc: accountDetail.vdesc,
            chqno: accountDetail.chqno,
            chqdate: accountDetail.chqdate !== null ? dateconvert(accountDetail.chqdate) : '',
            ref_no: accountDetail.ref_no,
            amountdr: accountDetail.amountdr,
            amountcr: accountDetail.amountcr
          }
        ]

        setTransactionDetail(data)
        setTransactionDetailTotal(data)
        setStates({ ...states, customMessage: '', isDetailError: false, isEdit: false })
      }

      resetAccountDetail()
    }
  }

  const handleEdit = data => {
    setAccountDetail({
      sno: data.sno,
      account: { value: data.acode, label: data.aname },
      vdesc: data.vdesc,
      chqno: data.chqno,
      chqdate: data.chqdate,
      ref_no: data.ref_no,
      amountdr: data.amountdr,
      amountcr: data.amountcr
    })
    setStates({ ...states, isEdit: true })
  }

  const handleDeleteAccount = row => {
    const filteredRow = transactionDetail.filter(item => item.sno !== row.sno)

    setTransactionDetail(filteredRow)
    setTransactionDetailTotal(filteredRow)
  }

  const handleResetForm = () => {
    setStates({
      isFind: false,
      isEdit: false,
      isSubmit: false,
      isLoading: false,
      isOpenModal: false,
      isError: false,
      customMessage: ''
    })
    setTransactionMaster({
      vtype: null,
      vno: '',
      vdate: new Date(),
      vdesc1: '',
      post: 'N'
    })
    setTransactionDetail([])
    setTransactionTotal({ dr: 0, cr: 0, rows: 0 })
    setAccountDetail({
      chqno: '',
      chqdate: '',
      sno: '',
      account: null,
      vdesc: '',
      ref_no: '',
      amountdr: 0,
      amountcr: 0
    })
    setDeleteStates({})
    push(`${asPath.split('?')[0]}`)
  }

  const handleSubmit = async post => {
    if (transactionMaster.vtype === null) {
      setStates({ ...states, isError: true })
    }
    if (!transactionMaster.vdate) {
      setStates({ ...states, isError: true })
    }

    if (transactionDetail.length === 0 || transactionTotal.dr !== transactionTotal.cr) {
      setStates({
        ...states,
        customMessage: 'Required Account Detail and Total of DR and CR must be equal and greater than 0',
        isDetailError: true,
        isError: true
      })
    }

    if (
      transactionMaster.vtype !== null &&
      transactionMaster.vdate &&
      transactionDetail.length > 0 &&
      transactionTotal.dr === transactionTotal.cr
    ) {
      setStates({ ...states, isSubmit: true, isError: false, customMessage: '' })
      await updateGLTransactions({
        vcode: transactionMaster.vtype.value,
        vno: transactionMaster.vno,
        vdate: dateconvert(transactionMaster.vdate),
        vdesc1: transactionMaster.vdesc1,
        post: post ? post : transactionMaster.post,
        detail: transactionDetail
      })
        .then(response => {
          if (account?.error) {
            toast.error(response.error.message)

            return
          }
          const vno = JSON.parse(response.data.string_out).code
          setTransactionMaster({ ...transactionMaster, vno, post: post ? post : transactionMaster.post })
          setStates({ ...states, isFind: true, isEdit: true, isSubmit: false, isLoading: false })
        })
        .catch(() => {
          setStates({ ...states, isSubmit: false, isLoading: false })
        })
    }
  }

  const handleConfirm = () => {
    setStates({ ...states, isOpenModal: true })
    setDeleteStates({
      vtype: transactionMaster.vtype,
      vno: transactionMaster.vno
    })
  }

  const onDelete = () => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    deleteGLTransactions({ vcode: deleteStates.vtype.value, vno: deleteStates.vno }).then(response => {
      if (response.payload !== false) {
        isOpenModal = false
        handleResetForm()
      } else {
        setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
      }
    })
  }

  const updateColumns =
    isAllowed(permissions, 'U') || isAllowed(permissions, 'D')
      ? [
          ...detailColumns,
          {
            sortable: false,
            filterable: false,
            editable: false,
            disableColumnMenu: false,
            flex: 1,
            minWidth: 100,
            align: 'right',
            headerAlign: 'right',
            headerName: 'Action',
            renderCell: ({ row }) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
                  <Tooltip title='Edit' placement='top'>
                    <IconButton size='small' onClick={() => handleEdit(row)}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete' placement='top'>
                    <IconButton size='small' onClick={() => handleDeleteAccount(row)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          }
        ]
      : detailColumns

  return states.isLoading ? (
    <Spinner />
  ) : (
    <>
      <form autoComplete='off'>
        <Card sx={{ mb: 5 }}>
          <Grid container spacing={3}>
            {states.customMessage.length > 0 && (
              <Grid item xs={12} mt={2} display='flex' justifyContent='center' alignItems='center'>
                <Chip size='small' color='error' label={states.customMessage} variant='outlined' />
              </Grid>
            )}

            <Grid item md={4} xs={12}>
              <CardHeader title={pageTitle} />
            </Grid>
            <Grid item xs={12} md={8} display='flex' justifyContent='right' alignItems='center'>
              <Box p={2}>
                {((isAllowed(permissions, 'C') && transactionMaster.vno.toString().length === 0) ||
                  (isAllowed(permissions, 'U') && transactionMaster.vno.toString().length > 0)) &&
                  transactionMaster.post === 'N' && (
                    <LoadingButton
                      sx={{ m: 1 }}
                      loading={states.isSubmit}
                      size='small'
                      variant='contained'
                      onClick={() => handleSubmit()}
                    >
                      <Icon icon='tabler:device-floppy' style={{ marginRight: 5 }} />{' '}
                      {transactionMaster.vno.toString().length > 0 ? 'Update' : 'Save'}
                    </LoadingButton>
                  )}
                {isAllowed(permissions, 'PU') && transactionMaster.vno.toString().length > 0 && (
                  <LoadingButton
                    sx={{ m: 1 }}
                    loading={states.isSubmit}
                    size='small'
                    variant='contained'
                    onClick={() => handleSubmit(transactionMaster.post === 'Y' ? 'N' : 'Y')}
                  >
                    <Icon icon='tabler:send' style={{ marginRight: 5 }} />
                    {transactionMaster.post === 'Y' ? 'Unpost' : 'Post'}
                  </LoadingButton>
                )}
                {isAllowed(permissions, 'D') &&
                  transactionMaster.vno.toString().length > 0 &&
                  transactionMaster.post === 'N' && (
                    <Button sx={{ m: 1 }} size='small' color='error' variant='outlined' onClick={() => handleConfirm()}>
                      <Icon icon='tabler:trash' style={{ marginRight: 5 }} /> Delete
                    </Button>
                  )}
                {isAllowed(permissions, 'P') && transactionMaster.vno.toString().length > 0 && (
                  <Link
                    style={{ margin: 3 }}
                    href={setRedirectUrl({
                      url: '/gl/transactions/print',
                      data: { vcode: transactionMaster?.vtype.value, vno: transactionMaster.vno }
                    })}
                    target='_blank'
                  >
                    <Button size='small' color='primary' variant='outlined'>
                      <Icon icon='tabler:printer' style={{ marginRight: 5 }} />
                      Print
                    </Button>
                  </Link>
                )}
                <Button sx={{ m: 1 }} size='small' color='primary' variant='outlined' onClick={handleResetForm}>
                  <Icon icon='tabler:rotate' rotate='90deg' style={{ marginRight: 5 }} />
                  Reset
                </Button>

                <Button
                  sx={{ m: 1 }}
                  type='reset'
                  size='small'
                  color='primary'
                  variant='outlined'
                  onClick={() => push('/gl/transactions/list')}
                >
                  <Icon icon='tabler:arrow-back-up' style={{ marginRight: 5 }} />
                  Back
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 5, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    id='vtype'
                    size='small'
                    options={voucherTypeOptions}
                    value={transactionMaster.vtype}
                    getOptionLabel={option => option.label}
                    onChange={(_, data) => {
                      setTransactionMaster({ ...transactionMaster, vtype: data })
                    }}
                    disabled={vcode}
                    renderInput={params => (
                      <TextField
                        {...params}
                        sx={{ backgroundColor: vcode && grey[100] }}
                        label='Voucher Type'
                        variant='outlined'
                        error={states.isError && transactionMaster.vtype === null}
                        helperText={states.isError && transactionMaster.vtype === null && errorMessage}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    disabled
                    id='vno'
                    fullWidth
                    focused
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    value={transactionMaster.vno}
                    label='Voucher No.'
                    placeholder='Voucher No.'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      id='vdate'
                      popperPlacement='bottom-start'
                      placeholderText='Voucher Date'
                      onChange={value => setTransactionMaster({ ...transactionMaster, vdate: value })}
                      selected={transactionMaster.vdate}
                      isClearable
                      showMonthDropdown
                      showYearDropdown
                      dateFormat='dd-MMM-yyyy'
                      customInput={
                        <CustomInput
                          size='small'
                          fullWidth
                          label='Voucher Date'
                          error={states.isError && !transactionMaster.vdate}
                          helperText={states.isError && !transactionMaster.vdate && errorMessage}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Grid>

                <Grid item xs={12} md={2} display='flex'>
                  <TextField
                    id='post'
                    value={transactionMaster.post === 'Y' ? 'POSTED' : 'UNPOSTED'}
                    label='Status'
                    fullWidth
                    inputProps={{ style: { textAlign: 'center', fontWeight: 'bold' } }}
                    color={transactionMaster.post === 'Y' ? 'primary' : 'error'}
                    focused
                    variant='outlined'
                    placeholder='Status'
                    size='small'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='vdesc1'
                inputProps={{ maxLength: 60 }}
                value={transactionMaster.vdesc1}
                label='Description'
                onChange={event => setTransactionMaster({ ...transactionMaster, vdesc1: event.target.value })}
                placeholder='Description'
                size='small'
              />
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ px: 5, py: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    id='account'
                    size='small'
                    options={accountOptions}
                    value={accountDetail.account}
                    getOptionLabel={option => option.label}
                    onChange={(_, data) => {
                      setAccountDetail({ ...accountDetail, account: data })
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Account'
                        variant='outlined'
                        error={states.isDetailError && accountDetail.account === null}
                        helperText={states.isDetailError && accountDetail.account === null && errorMessage}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    inputProps={{ maxLength: 30 }}
                    label='Description'
                    fullWidth
                    id='vdesc'
                    value={accountDetail.vdesc}
                    onChange={event => setAccountDetail({ ...accountDetail, vdesc: event.target.value })}
                    placeholder='Description'
                    size='small'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id='chqno'
                    fullWidth
                    value={accountDetail.chqno}
                    onChange={event => setAccountDetail({ ...accountDetail, chqno: event.target.value })}
                    inputProps={{ maxLength: 15 }}
                    label='Cheque No'
                    placeholder='Cheque No'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      popperPlacement='bottom-start'
                      placeholderText='Cheque Date'
                      id='chqdate'
                      selected={accountDetail.chqdate}
                      onChange={value => setAccountDetail({ ...accountDetail, chqdate: value })}
                      isClearable
                      showMonthDropdown
                      showYearDropdown
                      dateFormat='dd-MMM-yyyy'
                      customInput={<CustomInput size='small' fullWidth label='Cheque Date' />}
                    />
                  </DatePickerWrapper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label='Ref. No'
                    id='ref_no'
                    inputProps={{ maxLength: 15 }}
                    value={accountDetail.ref_no}
                    onChange={event => setAccountDetail({ ...accountDetail, ref_no: event.target.value })}
                    placeholder='Ref. No'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    id='amountdr'
                    value={accountDetail.amountdr}
                    onChange={event => setAccountDetail({ ...accountDetail, amountdr: event.target.value })}
                    error={states.isDetailError && accountDetail.amountdr === 0}
                    helperText={states.isDetailError && accountDetail.amountdr === 0 && errorMessage}
                    label='Debit'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    inputProps={{ maxLength: 12 }}
                    placeholder='Debit'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    id='amountcr'
                    value={accountDetail.amountcr}
                    onChange={event => setAccountDetail({ ...accountDetail, amountcr: event.target.value })}
                    error={states.isDetailError && accountDetail.amountcr === 0}
                    helperText={states.isDetailError && accountDetail.amountcr === 0 && errorMessage}
                    label='Credit'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    inputProps={{ maxLength: 12 }}
                    placeholder='Credit'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <ButtonGroup variant='contained' aria-label='outlined primary button group'>
                    <Tooltip title={states.isEdit ? 'Edit' : 'Add'} placement='top'>
                      <Button variant='outlined' color='primary' onClick={handleAdd}>
                        <Icon icon={`tabler:${states.isEdit ? 'edit' : 'plus'}`} />
                      </Button>
                    </Tooltip>
                    <Tooltip title='Reset' placement='top'>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={() => {
                          resetAccountDetail()
                          resetTransactionDetail()
                        }}
                      >
                        <Icon icon='tabler:rotate' rotate='90deg' />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DataGrid
            sx={{ fontSize: 12, mt: 3 }}
            rows={transactionDetail}
            autoHeight
            rowHeight={30}
            getRowId={row => `${row.sno}`}
            columns={updateColumns}
            disableSelectionOnClick
            paginationMode={{ pageSize: 10, page: 0 }}
          />
          <Grid container>
            <Grid item xs={6} display='flex' justifyContent='left' alignItems='center' sx={{ pr: 5 }}>
              <Typography variant='subtitle1'>Total Rows: {transactionTotal.rows}</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='right' alignItems='center' sx={{ pr: 5 }}>
              <Box
                boxShadow={5}
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 1,
                  backgroundColor:
                    transactionTotal.dr !== 0 && transactionTotal.dr === transactionTotal.cr ? green[100] : red[100]
                }}
              >
                <Typography variant='subtitle1'>TOTAL</Typography>
                <Divider />
                <Typography variant='subtitle2'>
                  <label style={{ marginRight: 5, borderRightStyle: 'solid', borderRightColor: '#cccccc' }}>
                    DEBIT: {transactionTotal.dr}{' '}
                  </label>
                  <label style={{ marginleft: 5 }}>CREDIT: {transactionTotal.cr}</label>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
        {/* -----Modal----- */}
        {
          <DeleteModal
            onsubmit={onsubmit}
            onDelete={onDelete}
            onCancel={() => setStates({ ...states, isOpenModal: false })}
            handleDiscard={handleResetForm}
            isSubmit={states.isSubmit}
            isOpenModal={states.isOpenModal}
            title={pageTitle}
          >
            <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
              <strong>
                <span>Voucher Type: {deleteStates?.vtype?.label}</span>
              </strong>
            </p>
            <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
              <strong>
                <span style={{ paddingLeft: 30 }}>Voucher No: {deleteStates.vno}</span>
              </strong>
            </p>
          </DeleteModal>
        }
      </form>
    </>
  )
}

export default TransactionsForm
