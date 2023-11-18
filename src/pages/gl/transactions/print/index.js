// ** React Imports
import { useState, useEffect } from 'react'
import { getGLTransactions } from 'src/store'
import Spinner from 'src/@core/components/spinner'

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
import { getVoucherTypeAPI } from 'src/configs'
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
    vtype: { value: '', label: '' },
    vno: '',
    vdate: new Date(),
    vdesc1: '',
    post: ''
  })

  const [transactionDetail, setTransactionDetail] = useState([])
  const [transactionTotal, setTransactionTotal] = useState({ dr: 0, cr: 0, rows: 0 })

  const setTransactionDetailTotal = data => {
    const sumDR = data.reduce(function (prev, current) {
      return prev + +current.amountdr
    }, 0)

    const sumCR = data.reduce(function (prev, current) {
      return prev + +current.amountcr
    }, 0)
    setTransactionTotal({ dr: sumDR, cr: sumCR, rows: data.length })
  }

  const initialized = async () => {
    const { vcode, vno } = getQueryStringParams(window.location.search.substring(1))
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
          vdate: row.vdate,
          vdesc1: row.vdesc1,
          post: row.post
        }

        const detail = responseData.map(item => ({
          sno: item.sno,
          acode: item.acode,
          aname: item.aname,
          vdesc: item.vdesc,
          chqno: item.chqno,
          chqdate: item.chqdate,
          ref_no: item.ref_no,
          amountdr: item.amountdr,
          amountcr: item.amountcr
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
                    <Typography variant='h3' color='primary' mt={1} ms={1}>
                      {clientConfig.clientName}
                    </Typography>
                  </Box>
                  <Typography variant='subtitle1'>{clientConfig.compaddress1}</Typography>
                  <Typography variant='subtitle1'>{clientConfig.compaddress2}</Typography>
                  <Typography variant='subtitle1'>{clientConfig.compcontact}</Typography>
                </Grid>
                <Grid xs={6} mt={2} sx={{ textAlign: 'right' }}>
                  <div>
                    <Typography variant='h4' mb={1}>
                      {transactionMaster.vtype.label}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='h4' mb={1}>
                      Voucher# {transactionMaster.vno}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='6' mb={1}>
                      Voucher Date: {dateconvert(transactionMaster.vdate)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='h5' mb={1}>
                      Status{' '}
                      {transactionMaster.post === 'Y' ? 'Posted' : transactionMaster.post === 'N' ? 'Unposted' : 'N/A'}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Divider />
              <Divider />
              <Grid container pb={2}>
                <Grid sm={12}>
                  <Typography variant='h5' mb={1}>
                    Description
                  </Typography>
                  <Typography mb={5}>{transactionMaster.vdesc1}</Typography>
                </Grid>
              </Grid>
              <Divider />
              <Table className='mt-2 mb-0' responsive>
                <TableHead>
                  <TableRow sx={{ backgroundColor: grey[100] }}>
                    <TableCell py={1}>SNO</TableCell>
                    <TableCell py={1} ps={2}>
                      ACCOUNT
                    </TableCell>
                    <TableCell py={1} ps={2}>
                      CHEQUE #
                    </TableCell>
                    <TableCell py={1} ps={2}>
                      CHEQUE DATE
                    </TableCell>
                    <TableCell py={1} ps={2}>
                      REF. No
                    </TableCell>
                    <TableCell py={1} ps={2}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell py={1}>DEBIT</TableCell>
                    <TableCell py={1}>CREDIT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionDetail.map(row => (
                    <TableRow key={row.sno}>
                      <TableCell>{row.sno}</TableCell>
                      <TableCell>
                        {row.acode} {row.aname}
                      </TableCell>
                      <TableCell>{row.chqno}</TableCell>
                      <TableCell>{row.chqdate !== null ? dateconvert(row.chqdate.slice(0, 10)) : ''}</TableCell>
                      <TableCell>{row.ref_no}</TableCell>
                      <TableCell>{row.vdesc}</TableCell>
                      <TableCell>{amountWithComma(row.amountdr)}</TableCell>
                      <TableCell>{amountWithComma(row.amountcr)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ backgroundColor: grey[100] }}>
                    <TableCell colSpan={6}>
                      <Typography variant='subtitle1' m={0} p={0}>
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle1' m={0} p={0}>
                        {amountWithComma(transactionTotal.dr)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle1' m={0} p={0}>
                        {amountWithComma(transactionTotal.cr)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <Grid container mt={3}>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' mb={0}>
                    <span>No of Rows:</span> <span>{transactionTotal.rows}</span>
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
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
