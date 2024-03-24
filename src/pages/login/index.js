// ** React Imports
import { useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import { themeConfig } from 'src/configs'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { Grid, Zoom } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-hot-toast'
import { clientConfig } from 'src/configs/clientConfig'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'
import { TypeAnimation } from 'react-type-animation'

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  position: 'absolute',
  zIndex: -1,
  height: '100%',
  width: '100%'
}))

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 470
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 470
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 470,
    display: 'flex',
    justifyContent: 'end',
    position: 'absolute',
    right: 0
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  username: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    setIsLoading(true)
    const { username, password } = data
    auth
      .login({ username, password, rememberMe }, () => {
        setError('username', {
          type: 'manual',
          message: 'User Name or Password is invalid'
        })
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }
  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ width: '100%', height: '100%' }} textAlign='center'>
          <Box
            display='flex'
            justifyContent='center'
            sx={{
              height: '100vh',
              width: '70%'
            }}
          >
            <Img alt='' src={`/images/Brandenburg-Gate-2-b.webp`} />
            <div
              style={{
                position: 'absolute',
                zIndex: -1,
                opacity: 0.7,
                backgroundColor: '#0332cb',
                width: '100%',
                height: '100%'
              }}
            ></div>

            <Grid container>
              <Grid item xs={12} pt={10} textAlign='center'>
                <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                  <Box fullWidth>
                    <ThemeProvider theme={theme}>
                      <IconButton>
                        <Box
                          width={150}
                          height={150}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                          borderRadius={5}
                          bgcolor='#fff'
                          boxShadow={5}
                        >
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sx={{
                                textAlign: 'center'
                              }}
                            >
                              <img src={'/images/logo.png'} height='100' alt={''} />
                            </Grid>
                          </Grid>
                        </Box>
                      </IconButton>
                      <Typography variant='h3' sx={{ color: '#fff', textDecoration: 'underline', my: 10 }}>
                        PrepAndAce
                      </Typography>
                      <Typography variant='h4' color='#fdfeff'>
                        Gateway to a bright future.
                      </Typography>
                      <Typography variant='h4' color='#fdfeff'>
                        Study in Germany.
                      </Typography>
                    </ThemeProvider>
                  </Box>
                </Zoom>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fff'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 350, alignItems: 'flex-start' }}>
            {hidden ? (
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start'
                  }}
                >
                  <div>
                    <img src={'/images/logo.png'} height='50' alt={''} />
                    <Typography sx={{ color: '#7367f0', mb: 1.5, fontWeight: 500, fontSize: '12' }}>
                      PrepAndAce
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    backgroundColor: 'customColors.bodyBg'
                  }}
                >
                  <img src={`/images/${clientConfig.picture}`} height='50' alt={''} />
                </Grid>
              </Grid>
            ) : null}
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {`Welcome to ${themeConfig.templateName}!`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please sign-in to your account and start your session
              </Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='User Name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      placeholder='User Name'
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 1.5 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>
              </Box>

              <LoadingButton
                loading={isLoading}
                fullWidth
                color='primary'
                size='large'
                type='submit'
                variant='contained'
                sx={{ mb: 4 }}
              >
                Login
              </LoadingButton>
              <Divider />
              <Box fullWidth textAlign='center' p={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Link href='/registration'>Create Account</Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Link href='/'>Back to Home</Link>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
