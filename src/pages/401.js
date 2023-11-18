// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import Icon from 'src/@core/components/icon'
import { yellow } from '@mui/material/colors'

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Error401 = () => {
  setTimeout(() => {
    return (
      <Box className='content-center'>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Icon icon='tabler:info-triangle' height={100} color={yellow[500]} />
          <BoxWrapper>
            <Typography variant='h4' sx={{ mb: 1.5 }}>
              You are not authorized!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to view this page using the credentials that you have provided while login.
            </Typography>
            <Typography sx={{ mb: 6, color: 'text.secondary' }}>Please contact your site administrator.</Typography>
          </BoxWrapper>
        </Box>
        <FooterIllustrations />
      </Box>
    )
  }, 1000)
}
Error401.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error401
