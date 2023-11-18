import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { amountWithComma, isAllowed } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { grey } from '@mui/material/colors'
import { accountBalanceColumns } from './static-data'

const AccountBalanceTab = ({ states }) => {
  // ** Master States ** //
  const permissions = usePermission()

  const { accountBalance, account } = states.data

  const [AcRec, setAcRec] = useState({
    acode: '',
    aname: '',
    odr: 0,
    ocr: 0,
    ytddr: 0,
    ytdcr: 0,
    cdr: 0,
    ccr: 0
  })

  const setTotal = data => {
    const sumDR = data.reduce(function (prev, current) {
      return prev + +current.dramt
    }, 0)

    const sumCR = data.reduce(function (prev, current) {
      return prev + +current.cramt
    }, 0)

    return { sumDR, sumCR }
  }

  // //**LOV Call Account**//
  useEffect(() => {
    const total = setTotal(accountBalance)
    const odr = accountBalance.length > 0 && accountBalance[0].odr
    const ocr = accountBalance.length > 0 && accountBalance[0].ocr
    const mcdr = odr - ocr + total.sumDR - total.sumCR

    const newAcRec = {
      acode: account.value,
      aname: account.label,
      odr,
      ocr,
      ytddr: total.sumDR,
      ytdcr: Math.abs(total.sumCR),
      cdr: 0,
      ccr: 0
    }

    if (mcdr < 0) {
      setAcRec({
        ...newAcRec,
        ccr: Math.abs(mcdr)
      })
    } else {
      setAcRec({
        ...newAcRec,
        cdr: mcdr
      })
    }
  }, [])

  return (
    <>
      <Grid container spacing={3} p={5}>
        <Grid item md={6} xs={12}>
          <Box display='flex' pb={2}>
            <Typography pl={2}>
              <strong>Account Code:</strong> {account.value}
            </Typography>
            <Typography pl={5}>
              <strong>Account Name:</strong> {account.label}
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ borderStyle: 'solid', borderColor: grey[100], minHeight: 233 }}>
            <Table className='table' style={{ fontWeight: 'bold' }}>
              <TableHead>
                <TableRow bgcolor={grey[100]}>
                  <TableCell></TableCell>
                  <TableCell align='right'>Debit</TableCell>
                  <TableCell align='right'>Credit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align='left'>Opening</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.odr)}</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.ocr)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='left'>YTD</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.ytddr)}</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.ytdcr)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='left'>Closing</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.cdr)}</TableCell>
                  <TableCell align='right'>{amountWithComma(AcRec.ccr)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={6} xs={12} sx={{ p: 5 }}>
          <>
            <Box display='flex' pb={2}>
              <Typography pl={2}>
                <strong>Monthly Summary</strong>
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ borderStyle: 'solid', borderColor: grey[100], height: 233 }}>
              <Table className='table table-' style={{ fontWeight: 'bold' }} stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {accountBalanceColumns.map(item => (
                      <TableCell key={item.field} align='center' sx={{ minWidth: item.minWidth }}>
                        {item.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountBalance.map(row => {
                    return (
                      <TableRow key={row.month}>
                        {accountBalanceColumns.map(item => (
                          <TableCell key={item.field} align={item.align}>
                            {item.amountWithComma ? amountWithComma(row[item.field]) : row[item.field]}
                          </TableCell>
                        ))}
                        {/* <TableCell align='right'>{amountWithComma(row.dramt)}</TableCell>
                        <TableCell align='right'>{amountWithComma(row.cramt)}</TableCell> */}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        </Grid>
      </Grid>
    </>
  )
}

export default AccountBalanceTab
