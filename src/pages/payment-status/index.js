import Grid from '@mui/material/Grid'
import Zoom from '@mui/material/Zoom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Spinner from 'src/@core/components/spinner'
import useClipboard from 'src/@core/hooks/useClipboard'
import axios from 'axios'
import { Box, Button, Toolbar, Typography, CircularProgress } from '@mui/material'
import { TypeAnimation } from 'react-type-animation'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const PaymentStatus = () => {
  const clipboard = useClipboard()
  const router = useRouter()
  const auth = useAuth()

  const [isWait, setIsWait] = useState(false)
  const [isLoad, setIsLoad] = useState(false)
  const [timer, setTimer] = useState(10)
  const [localStorageData, setLocalStorageData] = useState({})
  setTimeout(() => {
    setIsLoad(true)
    setTimer(timer - 1)
  }, 10000)

  const handleClipboard = params => {
    if (params?.target?.innerText?.length > 0) {
      clipboard.copy(params.target.innerText)
    }
    toast.success('Transaction ID has been copied!', {
      duration: 2000
    })
  }

  const getPaymentStatus = async () => {
    const order_id = window.localStorage.getItem('order_id')
    const merchant_order_id = window.localStorage.getItem('merchant_order_id')
    if (merchant_order_id && order_id) {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/paymobinquery`, {
        merchant_order_id,
        order_id
      })
      setLocalStorageData({ order_id, merchant_order_id })
    }
  }

  const setLogin = async () => {
    const email = window.localStorage.getItem('email')
    if (email) {
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/users?user_name=${email}`)
      if (userResponse.data.length > 0) {
        auth.login({ username: email, password: userResponse?.data[0]?.password, rememberMe: true }, () => {
          setError('username', {
            type: 'manual',
            message: 'User Name or Password is invalid'
          })
        })
      }
    }
  }
  useEffect(() => {
    getPaymentStatus()
  }, [])

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1)
      }, 1000)
    }

    // if (timer === 1 && localStorageData?.order_id) {
    if (timer === 1) {
      setLogin()
      window.localStorage.removeItem('order_id')
      window.localStorage.removeItem('merchant_order_id')

      // window.localStorage.removeItem('email')
      router.replace('./mycourses/list')
    }
  }, [timer])
  const theme = createTheme()
  theme.typography.h3 = {
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
      fontSize: '2rem'
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.5rem'
    }
  }
  theme.typography.h6 = {
    fontSize: '0.9rem',
    fontWeight: 'unset',
    '@media (min-width:600px)': {
      fontSize: '1rem'
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem'
    }
  }

  return isWait ? (
    <Box style={{ backgroundColor: '#ffffff57', width: '100%', position: 'absolute' }}>
      <Spinner />
    </Box>
  ) : (
    <Grid container>
      <Grid item xs={12}>
        <Box>
          <Grid container>
            <Grid item xs={12} pt={10} display='flex' justifyContent='center' alignItems='center'>
              <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
                <Box
                  sx={{
                    p: [6, 12],
                    height: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* {isLoad && (
                    <Box style={{ backgroundColor: '#ffffff57', width: '100%', position: 'absolute' }}>
                      <Spinner />
                    </Box>
                  )} */}
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Box sx={{ my: 6 }} textAlign='center'>
                      <Icon icon='tabler:circle-check' color='greenyellow' width={100} />
                      <Typography color='greenyellow' variant='h3'>
                        Payment Success
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        Transaction ID:
                        <Button variant='text' sx={{ mx: 5, px: 2, color: '#fff' }} onClick={handleClipboard}>
                          {localStorageData?.merchant_order_id}
                        </Button>
                      </Typography>
                      <Typography color='greenyellow' variant='subtitle2'>
                        Click to Copy Transaction ID
                      </Typography>
                      {!isLoad && (
                        <Box
                          style={{ height: '200px' }}
                          mt={5}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress size={100} />
                          <Typography sx={{ color: 'text.secondary', position: 'absolute', fontSize: 24 }}>
                            {timer}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
PaymentStatus.getLayout = page => <BlankLayout>{page}</BlankLayout>
PaymentStatus.guestGuard = true

export default PaymentStatus
