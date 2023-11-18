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
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import Link from 'next/link'

import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { getPurchase, updatePurchase, deletePurchase, getSupplier, getItem } from 'src/store'
import { toast } from 'react-hot-toast'
import {
  TransactionDetailRow,
  columns,
  detailColumns,
  isCashOptions
} from 'src/views/pages/inventory/transactions/purchase/static-data'
import { dateconvert, isAllowed, setRedirectUrl } from 'src/@core/utils'
import { print } from '../print'
import usePermission from 'src/@core/hooks/usePermission'
import DeleteModal from 'src/views/components/modal/delete-modal'
import { LoadingButton } from '@mui/lab'
import { getSupplierAPI, getItemAPI, purchaseVoucherType } from 'src/configs'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/components/date-picker/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { green, grey, red } from '@mui/material/colors'

const pageTitle = 'Purchases'
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

  const [suppOptions, setSuppOptions] = useState([])
  const [itemOptions, setItemOptions] = useState([])

  const [transactionMaster, setTransactionMaster] = useState({
    vcode: purchaseVoucherType,
    vno: '',
    vdate: new Date(),
    supplier: null,
    refno: '',
    iscash: 'Y',
    post: 'N',
    desc1: ''
  })

  const [transactionDetail, setTransactionDetail] = useState([])
  const [transactionTotal, setTransactionTotal] = useState({ disc_amt: 0, amount: 0, rows: 0 })

  const [purchaseDetail, setPurchaseDetail] = useState({
    sno: '',
    item: null,
    rate: 0,
    qty: 0,
    disc_per: 0,
    disc_amt: 0,
    amount: 0
  })
  const [deleteStates, setDeleteStates] = useState({})

  const initialized = async () => {
    //Bind Supplier List
    const suppResponse = await getSupplierAPI()
    if (suppResponse?.error) {
      toast.error(suppResponse.error.message)

      return
    }

    const suppData = suppResponse?.data.items
    setSuppOptions(
      suppData?.map(item => ({ value: item?.suppliercode, label: `${item?.suppliername} ${item?.suppliercode}` }))
    )
    if (vcode && vno) {
      findTransaction({ vcode, vno })
    } else {
      setStates({ ...states, isLoading: false })
    }

    const itemResponse = await getItemAPI()

    if (itemResponse?.error) {
      toast.error(itemResponse.error.message)

      return
    }
    const itemData = itemResponse?.data.items ?? []

    setItemOptions(itemData?.map(item => ({ value: item.icode, label: `${item.iname} ${item.icode}` })))
  }

  useEffect(() => {
    initialized()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vcode, vno])

  const findTransaction = async ({ vcode, vno }) => {
    setStates({ ...states, isLoading: true })

    await getPurchase({ vcode, vno })
      .then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }
        const responseData = response.items[0]

        const master = {
          vcode: purchaseVoucherType,
          vno: responseData.vno,
          vdate: new Date(responseData.vdate),
          supplier: { value: responseData.sup_code, label: responseData.sup_name },
          refno: responseData.refno,
          iscash: responseData.iscash,
          post: responseData.post,
          desc1: responseData?.desc1
        }

        const detail = responseData.ptran.map(item => ({
          sno: item.sno,
          icode: item.icode,
          iname: item.iname,
          rate: item.rate,
          qty: item.qty,
          disc_per: item.disc_per,
          disc_amt: item.disc_amt,
          amount: item.amount
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

  const resetPurchaseDetail = () => {
    setPurchaseDetail({
      sno: '',
      item: null,
      rate: 0,
      qty: 0,
      disc_per: 0,
      disc_amt: 0,
      amount: 0
    })
  }

  const resetTransactionDetail = () => {
    setTransactionDetail([])
    setTransactionTotal({ disc_amt: 0, amount: 0, rows: 0 })
  }

  const setTransactionDetailTotal = data => {
    const sumDisc_amt = data.reduce(function (prev, current) {
      return prev + +current.disc_amt
    }, 0)

    const sumAmount = data.reduce(function (prev, current) {
      return prev + +current.amount
    }, 0)
    setTransactionTotal({ disc_amt: sumDisc_amt, amount: sumAmount, rows: data.length })
  }

  const handleAdd = () => {
    if (!purchaseDetail.item?.value) {
      setStates({ ...states, isDetailError: true })
    }

    if (!purchaseDetail.qty > 0) {
      setStates({ ...states, isDetailError: true })
    }

    if (purchaseDetail.item?.value && purchaseDetail.qty > 0) {
      if (states.isEdit) {
        const editedDetail = transactionDetail.map(obj => {
          // 👇️ if id equals 2, update country property
          if (obj.sno === purchaseDetail.sno) {
            return {
              ...obj,
              sno: purchaseDetail.sno,
              item: purchaseDetail.item,
              rate: purchaseDetail.rate,
              qty: purchaseDetail.qty,
              dsic_per: purchaseDetail.disc_per,
              disc_amt: purchaseDetail.disc_amt,
              amount: purchaseDetail.amount
            }
          }

          // 👇️ otherwise return object as is
          return obj
        })

        setTransactionDetail(editedDetail)
        setTransactionDetailTotal(editedDetail)
        setStates({ ...states, isEdit: false })
      } else {
        setStates({ ...states, customMessage: '', isDetailError: false })

        const sno = transactionDetail.length + 1

        const data = [
          ...transactionDetail,
          {
            sno,
            icode: purchaseDetail.item?.value,
            iname: purchaseDetail.item?.label,
            rate: purchaseDetail.rate,
            qty: purchaseDetail.qty,
            disc_per: purchaseDetail.disc_per,
            disc_amt: purchaseDetail.disc_amt,
            amount: purchaseDetail.amount
          }
        ]
        setTransactionDetail(data)
        setTransactionDetailTotal(data)
      }

      resetPurchaseDetail()
    }
  }

  const handleEdit = data => {
    setPurchaseDetail({
      sno: data.sno,
      item: { value: data.icode, label: data.iname },
      rate: data.rate,
      qty: data.qty,
      disc_per: data.disc_per,
      disc_amt: data.disc_amt,
      amount: data.amount
    })
    setStates({ ...states, isEdit: true })
  }

  const handleDeleteItem = row => {
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
      vcode: purchaseVoucherType,
      vno: '',
      vdate: new Date(),
      supplier: null,
      refno: '',
      iscash: 'Y',
      post: 'N',
      desc1: ''
    })
    setTransactionDetail([])
    setTransactionTotal({ disc_amt: 0, amount: 0, rows: 0 })
    setPurchaseDetail({
      sno: '',
      item: null,
      rate: '',
      qty: '',
      disc_per: 0,
      disc_amt: 0,
      amount: 0
    })
    setDeleteStates({})
    push(`${asPath.split('?')[0]}`)
  }

  const handleSubmit = async post => {
    if (
      !transactionMaster.vcode ||
      !transactionMaster.supplier?.value ||
      transactionMaster.vdate.toString().length === 0
    ) {
      setStates({ ...states, isError: true })
    }

    if (transactionDetail.length === 0) {
      setStates({
        ...states,
        customMessage: 'Item Detail is required !',
        isDetailError: true,
        isError: true
      })
    }

    if (
      transactionMaster.vcode &&
      transactionMaster.supplier?.value &&
      transactionMaster.vdate.toString().length > 0 &&
      transactionDetail.length > 0
    ) {
      setStates({ ...states, isSubmit: true, isError: false, isDetailError: false, customMessage: '' })
      await updatePurchase({
        vcode: transactionMaster.vcode,
        vno: transactionMaster.vno,
        vdate: dateconvert(transactionMaster.vdate),
        sup_code: transactionMaster.supplier.value,
        refno: transactionMaster.refno,
        iscash: transactionMaster.iscash,
        post: post ? post : transactionMaster.post,
        desc1: transactionMaster.desc1,
        detail: transactionDetail
      })
        .then(response => {
          if (response?.error) {
            toast.error(response.error.message)

            return
          }
          const vno = JSON.parse(response.data.string_out).code
          setTransactionMaster({ ...transactionMaster, vno, post: post ? post : transactionMaster.post })
          setStates({ ...states, isFind: true, isEdit: false, isSubmit: false, isLoading: false })
        })
        .catch(() => {
          setStates({ ...states, isSubmit: false, isLoading: false })
        })
    }
  }

  const handleConfirm = () => {
    setStates({ ...states, isOpenModal: true })
    setDeleteStates({
      vcode: transactionMaster.vcode,
      vno: transactionMaster.vno
    })
  }

  const onDelete = () => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    deletePurchase({ vcode: deleteStates.vcode, vno: deleteStates.vno }).then(response => {
      if (response.payload !== false) {
        isOpenModal = false
        handleResetForm()
      } else {
        setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
      }
    })
  }

  const handlePurchaseDetailChange = (event, data) => {
    let disc_amt = 0
    let amount = 0

    //On Item Change//
    if (event.target.id.startsWith('item')) {
      disc_amt = (purchaseDetail.rate / 100) * purchaseDetail.disc_per
      amount = purchaseDetail.rate - disc_amt
      setPurchaseDetail({ ...purchaseDetail, item: data, qty: 1, disc_amt, amount })
    }

    //On Rate Change//
    if (event.target.id === 'rate') {
      disc_amt = ((event.target.value * purchaseDetail.qty) / 100) * purchaseDetail.disc_per
      amount = event.target.value * purchaseDetail.qty - disc_amt
      setPurchaseDetail({ ...purchaseDetail, rate: event.target.value, disc_amt, amount })
    }

    //On Quantity Change//
    if (event.target.id === 'qty') {
      disc_amt = ((purchaseDetail.rate * event.target.value) / 100) * purchaseDetail.disc_per
      amount = purchaseDetail.rate * event.target.value - disc_amt
      setPurchaseDetail({ ...purchaseDetail, qty: event.target.value, disc_amt, amount })
    }

    //On Discount Percentage Change//
    if (event.target.id === 'disc_per') {
      let disc_per = event.target.value
      if (disc_per < 0) {
        disc_per = 0
      }
      if (disc_per > 100) {
        disc_per = parseInt(disc_per.toString().substring(0, disc_per.toString().length - 1))
      }
      disc_amt = ((purchaseDetail.rate * purchaseDetail.qty) / 100) * disc_per
      amount = purchaseDetail.rate * purchaseDetail.qty - disc_amt
      setPurchaseDetail({ ...purchaseDetail, disc_per: disc_per, disc_amt, amount })
    }

    //On Discount Amount Change//
    if (event.target.id === 'disc_amt') {
      const disc_per = (event.target.value * 100) / (purchaseDetail.rate * purchaseDetail.qty)
      amount = purchaseDetail.rate * purchaseDetail.qty - event.target.value
      setPurchaseDetail({ ...purchaseDetail, disc_per, disc_amt: event.target.value, amount })
    }
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
                    <IconButton size='small' onClick={() => handleDeleteItem(row)}>
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

            <Grid item xs={12} md={4}>
              <CardHeader title={pageTitle} />
            </Grid>
            <Grid item xs={12} md={8} display='flex' p={2} justifyContent='right' alignItems='center'>
              <Box style={{ minWidth: 200, overflow: 'hidden' }}>
                {((isAllowed(permissions, 'C') && transactionMaster.vno.toString().length === 0) ||
                  (isAllowed(permissions, 'U') &&
                    transactionMaster.vno.toString().length > 0 &&
                    transactionMaster.post === 'N')) && (
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
                    <Button size='small' sx={{ m: 1 }} color='error' variant='outlined' onClick={() => handleConfirm()}>
                      <Icon icon='tabler:trash' style={{ marginRight: 5 }} /> Delete
                    </Button>
                  )}
                {isAllowed(permissions, 'P') && transactionMaster.vno.toString().length > 0 && (
                  <Link
                    style={{ margin: 3 }}
                    href={setRedirectUrl({
                      url: '/inventory/transactions/purchase/print',
                      data: { vno: transactionMaster.vno }
                    })}
                    target='_blank'
                  >
                    <Button size='small' color='primary' variant='outlined'>
                      <Icon icon='tabler:printer' style={{ marginRight: 5 }} />
                      Print
                    </Button>
                  </Link>
                )}
                <Button size='small' color='primary' sx={{ m: 1 }} variant='outlined' onClick={handleResetForm}>
                  <Icon icon='tabler:rotate' rotate='90deg' style={{ marginRight: 5 }} />
                  Reset
                </Button>

                <Button
                  type='reset'
                  sx={{ m: 1 }}
                  size='small'
                  color='primary'
                  variant='outlined'
                  onClick={() => push('/inventory/transactions/purchase/list')}
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
            <Grid item xs={12} md={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <TextField
                    disabled
                    fullWidth
                    id='vno'
                    focused
                    sx={{ backgroundColor: grey[200] }}
                    variant='outlined'
                    color='secondary'
                    value={transactionMaster.vno}
                    label='Voucher No.'
                    placeholder='Voucher No.'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <DatePickerWrapper>
                    <DatePicker
                      id='vdate'
                      popperPlacement='bottom-start'
                      placeholderText='Voucher Date'
                      onChange={value => setTransactionMaster({ ...transactionMaster, vdate: new Date(value) })}
                      selected={transactionMaster.vdate}
                      showYearDropdown
                      showMonthDropdown
                      dateFormat='dd-MMM-yyyy'
                      customInput={
                        <CustomInput
                          size='small'
                          fullWidth
                          label='Voucher Date'
                          error={states.isError && !transactionMaster?.vdate?.length === 0}
                          helperText={states.isError && transactionMaster?.vdate?.length === 0 && errorMessage}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                id='supplier'
                size='small'
                options={suppOptions}
                value={transactionMaster.supplier}
                getOptionLabel={option => option.label}
                onChange={(_, data) => {
                  setTransactionMaster({ ...transactionMaster, supplier: data })
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Supplier'
                    variant='outlined'
                    error={states.isError && !transactionMaster.supplier?.value}
                    helperText={states.isError && !transactionMaster.supplier && errorMessage}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3} display='flex'>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 30 }}
                    label='Manual Bill No.'
                    id='refno'
                    value={transactionMaster.refno}
                    onChange={row => setTransactionMaster({ ...transactionMaster, refno: row.target.value })}
                    placeholder='Manual Bill No.'
                    size='small'
                  />
                </Grid>

                <Grid item xs={12} md={5} display='flex'>
                  <FormControl fullWidth size='small' variant='filled'>
                    <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                      {isCashOptions.map(item => {
                        return (
                          <FormControlLabel
                            key={item.id}
                            isOptionEqualToValue={item.value}
                            value={item.value}
                            onChange={row => setTransactionMaster({ ...transactionMaster, iscash: row.target.value })}
                            control={<Radio checked={transactionMaster.iscash === item.value} />}
                            label={item.title}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} display='flex'>
                  <TextField
                    id='post'
                    fullWidth
                    value={transactionMaster.post === 'Y' ? 'POSTED' : 'UNPOSTED'}
                    label='Status'
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
          </Grid>
          <Grid container>
            <Grid item xs={12} mt={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 30 }}
                label='Description'
                id='desc1'
                value={transactionMaster.desc1}
                onChange={row => setTransactionMaster({ ...transactionMaster, desc1: row.target.value })}
                placeholder='Description'
                size='small'
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ px: 5, py: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}>
              <Autocomplete
                id='item'
                size='small'
                options={itemOptions}
                value={purchaseDetail.item}
                getOptionLabel={option => option.label}
                onChange={(event, data) => handlePurchaseDetailChange(event, data)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Item'
                    fullWidth
                    variant='outlined'
                    error={states.isDetailError && !purchaseDetail.item?.value}
                    helperText={states.isDetailError && !purchaseDetail.item?.value && errorMessage}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 30 }}
                    label='Rate'
                    id='rate'
                    value={purchaseDetail.rate}
                    onChange={handlePurchaseDetailChange}
                    placeholder='Rate'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    id='qty'
                    fullWidth
                    value={purchaseDetail.qty}
                    onChange={handlePurchaseDetailChange}
                    inputProps={{ maxLength: 15, min: 0 }}
                    label='Quantity'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    placeholder='Quantity'
                    size='small'
                    error={states.isDetailError && !purchaseDetail.qty > 0}
                    helperText={states.isDetailError && !purchaseDetail.qty > 0 && errorMessage}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label='Disc %'
                    id='disc_per'
                    value={purchaseDetail.disc_per}
                    onChange={handlePurchaseDetailChange}
                    placeholder='Disc %'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id='disc_amt'
                    value={purchaseDetail.disc_amt}
                    onChange={handlePurchaseDetailChange}
                    label='Disc. Amt'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    inputProps={{ maxLength: 5 }}
                    placeholder='Disc. Amt'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id='amount'
                    value={purchaseDetail.amount}
                    label='Amount'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    disabled
                    sx={{ bgcolor: grey[200] }}
                    inputProps={{ maxLength: 12 }}
                    placeholder='Amount'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <ButtonGroup variant='contained' aria-label='outlined primary button group'>
                    <Tooltip title={states.isEdit ? 'Edit' : 'Add'} placement='top'>
                      <Button variant='outlined' sx={{ height: 40 }} color='primary' onClick={handleAdd}>
                        <Icon icon={`tabler:${states.isEdit ? 'edit' : 'plus'}`} />
                      </Button>
                    </Tooltip>
                    <Tooltip title='Reset' placement='top'>
                      <Button
                        variant='outlined'
                        sx={{ height: 40 }}
                        color='error'
                        onClick={() => {
                          resetPurchaseDetail()
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
          <Grid container sx={{ bgcolor: grey[200], p: 2 }}>
            <Grid item md={4} xs={12} display='flex' justifyContent='center' alignItems='center' sx={{ pr: 5 }}>
              <Typography variant='subtitle1'>Total Rows: {transactionTotal.rows}</Typography>
            </Grid>
            <Grid item md={4} xs={12} display='flex' justifyContent='center' alignItems='center' sx={{ pr: 5 }}>
              <Typography variant='subtitle1'>Total Discount: {transactionTotal.disc_amt}</Typography>
            </Grid>
            <Grid item md={4} xs={12} display='flex' justifyContent='center' alignItems='center' sx={{ pr: 5 }}>
              <Typography variant='subtitle1'>Total Amount: {transactionTotal.amount}</Typography>
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
