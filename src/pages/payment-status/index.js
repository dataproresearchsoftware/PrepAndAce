import Grid from '@mui/material/Grid'
import Zoom from '@mui/material/Zoom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Spinner from 'src/@core/components/spinner'
import useClipboard from 'src/@core/hooks/useClipboard'
import axios from 'axios'
import { Box, Button, Toolbar, Typography, CircularProgress, Tooltip } from '@mui/material'
import { TypeAnimation } from 'react-type-animation'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import styled from '@emotion/styled'
import Link from 'next/link'

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  position: 'absolute',
  zIndex: -1,
  height: '100%'
}))

const PaymentStatus = () => {
  const clipboard = useClipboard()
  const router = useRouter()
  const auth = useAuth()

  const [isWait, setIsWait] = useState(false)
  const [isLoad, setIsLoad] = useState(false)
  const [timer, setTimer] = useState(10)
  const [userPassword, setUserPassword] = useState('N/A')
  const [localStorageData, setLocalStorageData] = useState({})
  setTimeout(() => {
    setIsLoad(true)
    setTimer(timer - 1)
  }, 10000)

  const handleClipboard = params => {
    console.log(params)
    if (params?.target?.innerText?.length > 0) {
      clipboard.copy(params.target.innerText)
    }
    toast.success('Transaction ID has been copied!', {
      duration: 2000
    })
  }

  const getPaymentStatus = async () => {
    setIsWait(true)
    const order_id = window.localStorage.getItem('order_id')
    const merchant_order_id = window.localStorage.getItem('merchant_order_id')
    if (merchant_order_id && order_id) {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/paymobinquery`, {
          merchant_order_id,
          order_id
        })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          toast.error(`Error: ${error}`)
        })
        .finally(() => {})
      setIsWait(false)
      setLocalStorageData({ order_id, merchant_order_id })
    }
  }

  const setLogin = async () => {
    console.log('setLogin')
    const email = window.localStorage.getItem('email')
    console.log('email', email)
    if (email) {
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/users?user_name=${email}`)
      console.log('userResponse', userResponse)
      setUserPassword(userResponse?.data[0]?.password)

      // if (userResponse.data.length > 0) {
      //   auth.login({ username: email, password: userResponse?.data[0]?.password, rememberMe: true }, () => {
      //     setError('username', {
      //       type: 'manual',
      //       message: 'User Name or Password is invalid'
      //     })
      //   })
      // }
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
      //router.replace('./mycourses/list')
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
  ) : localStorageData.merchant_order_id ? (
    <Grid container>
      <StyledGrid item xs={12} md={6}>
        <Img alt='' src={`/images/Brandenburg-Gate-2-b.webp`} />
        <div
          style={{
            position: 'absolute',
            zIndex: -1,
            opacity: 0.7,
            backgroundColor: '#ffffff',
            width: '100%',
            height: '100%'
          }}
        ></div>
      </StyledGrid>
      <Grid item xs={12}>
        <Box>
          <Grid container>
            <Grid item xs={12} p={2}>
              <Box
                position='absolute'
                bgcolor='#fff'
                boxShadow={5}
                width={110}
                height={110}
                p={2}
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                borderRadius={3}
              >
                <img src={'/images/logo.png'} height='50' alt={''} />
                <Typography sx={{ color: '#7367f0', mb: 1.5, fontWeight: 500, fontSize: '12' }}>PrepAndAce</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ pt: { md: 10, xs: 70 } }}
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
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
                      {localStorageData?.merchant_order_id ? (
                        <Icon icon='tabler:circle-check' color='green' width={100} />
                      ) : (
                        <Icon icon='tabler:circle-x' color='red' width={100} />
                      )}
                      <Typography color='success' variant='h3'>
                        Payment Success
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
                      <Box borderRadius={5} bgcolor='#fff' boxShadow={5} p={2} my={2}>
                        <Typography color='primary' variant='h6'>
                          Transaction ID
                        </Typography>
                        <Typography color='primary' variant='h6'>
                          <Tooltip title='Click to Copy'>
                            <Button variant='text' sx={{ mx: 5, px: 2 }} onClick={handleClipboard}>
                              {localStorageData?.merchant_order_id ?? 'N/A'}
                            </Button>
                          </Tooltip>
                        </Typography>
                      </Box>
                      <Box borderRadius={5} bgcolor='#fff' boxShadow={5} p={2} mb={10}>
                        <Typography color='primary' variant='h6'>
                          Password
                        </Typography>
                        <Typography color='primary'>
                          <Tooltip title='Click to Copy'>
                            <Button variant='text' sx={{ mx: 5, px: 2 }} onClick={handleClipboard}>
                              {localStorageData?.merchant_order_id ? userPassword : 'N/A'}
                            </Button>
                          </Tooltip>
                        </Typography>
                      </Box>
                      <Link href='/login'>Go To Login</Link>
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  ) : (
    <p> Something went wrong</p>
  )
}
PaymentStatus.getLayout = page => <BlankLayout>{page}</BlankLayout>
PaymentStatus.guestGuard = true

export default PaymentStatus
