// ** React Imports
import { useState, useEffect } from 'react'
import { getSales } from 'src/store'
import Spinner from 'src/@core/components/spinner'
import { numberToWords } from 'amount-to-words'
import { amountWithComma, dateconvert, getQueryStringParams } from 'src/@core/utils'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { getVoucherTypeAPI, salesVoucherType } from 'src/configs'
import { clientConfig } from 'src/configs/clientConfig'
import { grey } from '@mui/material/colors'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Print = () => {
  const [states, setStates] = useState({
    isFind: false,
    isLoading: true,
    isOpenModal: false,
    isError: false,
    isDetailError: false,
    customMessage: ''
  })

  const [transactionMaster, setTransactionMaster] = useState({
    vcode: { value: '', label: '' },
    vno: '',
    vdate: new Date(),
    cus_code: '',
    post: ''
  })

  const [transactionDetail, setTransactionDetail] = useState([])

  const [transactionTotal, setTransactionTotal] = useState({
    qty: 0,
    disc_amt: 0,
    amount: 0,
    rows: 0,
    amountInWords: ''
  })

  const setTransactionDetailTotal = data => {
    const sumDisc_amt = data.reduce(function (prev, current) {
      return prev + +current.disc_amt
    }, 0)

    const sumAmount = data.reduce(function (prev, current) {
      return prev + +current.amount
    }, 0)

    const sumQty = data.reduce(function (prev, current) {
      return prev + +current.qty
    }, 0)

    const amountInWords = `${numberToWords(sumAmount)}`

    setTransactionTotal({
      qty: sumQty,
      disc_amt: sumDisc_amt,
      amount: sumAmount,
      rows: data.length,
      amountInWords: `${amountInWords} ${amountInWords.length > 0 ? 'Only' : ''}`
    })
  }

  const initialized = async () => {
    const { vcode, vno } = getQueryStringParams(window.location.search.substring(1))
    const voucherTypeResponse = await getVoucherTypeAPI()
    const voucherTypeData = voucherTypeResponse.data.items
    setStates({ ...states, isLoading: true })
    await getSales({ vcode: salesVoucherType, vno })
      .then(response => {
        if (response?.error) {
          toast.error(response.error.message)

          return
        }
        const responseData = response.items[0]

        const master = {
          vcode: responseData.vcode,
          vno: responseData.vno,
          vdate: responseData.vdate,
          cus_code: responseData.cus_code,
          cus_name: responseData.cus_name,
          post: responseData.post
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
        setStates({ ...states, isLoading: false, isFind: false, isFind: true })

        setTimeout(() => window.print(), 50)
        setTimeout(() => window.close(), 50)
      })
      .catch(() => {
        setStates({ ...states, isLoading: false, isFind: false })
      })
  }
  useEffect(() => {
    initialized()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function refreshPage() {
    window.location.reload(false)
  }

  return (
    <div>
      {states.isFind ? (
        <Grid container>
          <Grid item xs={12}>
            <Box p={3}>
              <Grid container pb={2}>
                <Grid item xs={6}>
                  <Box display='flex' mb={1}>
                    <img src={`/images/${clientConfig.picture}`} height='48' alt={''} />
                    <Typography variant='h6' color='primary' mt={2} pl={3}>
                      {clientConfig.compname}
                    </Typography>
                  </Box>

                  <Typography variant='subtitle2'>{clientConfig.compcontact}</Typography>
                  <Typography variant='subtitle2'>{clientConfig.compemail}</Typography>
                  <Typography variant='subtitle2'>{clientConfig.compaddress2}</Typography>
                </Grid>
                <Grid item xs={6} mt={2} sx={{ textAlign: 'right' }}>
                  <div>
                    <Typography variant='h5'>Sales Invoice # {transactionMaster.vno}</Typography>
                    <Typography variant='subtitle2'>Invoice Date: {dateconvert(transactionMaster.vdate)}</Typography>
                    <Typography variant='subtitle2' mb={2}>
                      Status:{' '}
                      {transactionMaster.post === 'Y' ? 'Posted' : transactionMaster.post === 'N' ? 'Unposted' : 'N/A'}
                    </Typography>
                    <Typography variant='subtitle1'>
                      Customer: {transactionMaster.cus_name} - {transactionMaster.cus_code}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Divider />

              <Table sx={{ minWidth: 650 }} className='font-9' size='small' aria-label='a dense table'>
                {/* <Table className='' responsive> */}
                <TableHead>
                  <TableRow sx={{ backgroundColor: grey[200] }}>
                    <TableCell sx={{ textAlign: 'center' }}>SNO</TableCell>
                    <TableCell>ITEM</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>QUANTITY</TableCell>
                    <TableCell sx={{ textAlign: 'end' }}>RATE</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>DISC%</TableCell>
                    <TableCell sx={{ textAlign: 'end' }}>DISC.AMT</TableCell>
                    <TableCell sx={{ textAlign: 'end' }}>AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionDetail.map(row => (
                    <TableRow key={row.sno}>
                      <TableCell sx={{ width: 30 }}>{row.sno}</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>{row.iname}</TableCell>
                      <TableCell sx={{ maxWidth: 150, textAlign: 'center' }}>{row.qty}</TableCell>
                      <TableCell sx={{ maxWidth: 150, textAlign: 'end' }}>{amountWithComma(row.rate)}</TableCell>
                      <TableCell sx={{ maxWidth: 150, textAlign: 'center' }}>{row.disc_per}</TableCell>
                      <TableCell sx={{ maxWidth: 150, textAlign: 'end' }}>{amountWithComma(row.disc_amt)}</TableCell>
                      <TableCell sx={{ maxWidth: 150, textAlign: 'end' }}>{amountWithComma(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ backgroundColor: grey[200] }}>
                    <TableCell colSpan={2}>
                      <Typography variant='subtitle1' m={0} p={0}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle1' m={0} p={0} sx={{ textAlign: 'center' }}>
                        {amountWithComma(transactionTotal.qty)}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell>
                      <Typography variant='subtitle1' m={0} p={0} sx={{ textAlign: 'end' }}>
                        {amountWithComma(transactionTotal.disc_amt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle1' m={0} p={0} sx={{ textAlign: 'end' }}>
                        {amountWithComma(transactionTotal.amount)}
                        {/* {transactionTotal.amount > 0 && '/-'} */}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <Grid container mt={3}>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' mb={0}>
                    <span>No of Items:</span> <span>{transactionTotal.rows}</span>
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
              <Grid container>
                <Grid item xs={12} pt={2}>
                  <Typography sx={{ paddingLeft: 2 }} variant='h6'>
                    <span style={{ fontWeight: 'bold' }}>In Words:</span>{' '}
                    <span style={{ textDecoration: 'underline' }}>{transactionTotal.amountInWords}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} pt={2} sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                  <Typography
                    sx={{ fontStyle: 'italic', textDecoration: 'underline', textAlign: 'right' }}
                    variant='subtitle2'
                  >
                    This is computer generated invoice no signature required
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      ) : (
        ''
      )}

      {/* Wait Modal*/}
      {states.isLoading ? <Spinner /> : null}
      {!states.isFind && !states.isLoading ? (
        <Dialog open={true} aria-labelledby='alert-dialog' aria-describedby='alert-dialog-description'>
          <DialogContent>
            <Button variant='contained' onClick={refreshPage}>
              Reload
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}

Print.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Print
