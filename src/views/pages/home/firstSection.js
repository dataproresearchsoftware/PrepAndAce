// ** MUI Imports
import Grid from '@mui/material/Grid'
import Zoom from '@mui/material/Zoom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { Box, Button, Toolbar, Typography } from '@mui/material'
import { TypeAnimation } from 'react-type-animation'
import { styled } from '@mui/material/styles'

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  position: 'absolute',
  zIndex: -1,
  backgroundColor: '#0045f8'
}))

const FirstSection = () => {
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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          sx={{
            pt: { xs: 0, md: 15 },
            height: '90vh',
            width: '100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
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
          {/* <img
            src={'/images/Brandenburg-Gate-2.jpg'}
            style={{ position: 'absolute', height: 630, width: '100%', zIndex: -1 }}
            alt={''}
          /> */}
          <Grid container>
            <Grid item xs={12} pt={10} display='flex' justifyContent='center' alignItems='center'>
              <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                <Box component='main' sx={{ px: 20, maxWidth: 900 }}>
                  <ThemeProvider theme={theme}>
                    <Typography variant='h3' textAlign='center' style={{ color: '#fff' }}>
                      An assured career abroad
                    </Typography>

                    <Typography variant='h6' mt={3} textAlign='center' style={{ color: '#fff' }}>
                      {/* <TypeAnimation
                        sequence={[
                          'A beginner,having no formal education but with a strong desire to learn,or an expert professional, want in globe the first selection choice for a potential job; PrepAndAce successfully prepares you and makes you the most desired candidate for employment in Germany. PrepAndAce teaches you the mandatory hard and soft skills, specifically designed for today’s requirements of  the German job market. PrepAndAce helps you all the way in the path of your journey to a promising  career; from getting trained,find in gand applying for a job, preparing for the job interview, completion of necessary documentation and formalities for moving and settling in Germany.Unlock and embark upon a guaranteed career in Germany.',
                          500
                        ]}
                        wrapper='span'
                        speed={80}
                        repeat={1}
                      /> */}
                      A beginner,having no formal education but with a strong desire to learn,or an expert professional,
                      want in globe the first selection choice for a potential job; PrepAndAce successfully prepares you
                      and makes you the most desired candidate for employment in Germany. PrepAndAce teaches you the
                      mandatory hard and soft skills, specifically designed for today’s requirements of the German job
                      market. PrepAndAce helps you all the way in the path of your journey to a promising career; from
                      getting trained,find in gand applying for a job, preparing for the job interview, completion of
                      necessary documentation and formalities for moving and settling in Germany.Unlock and embark upon
                      a guaranteed career in Germany.
                    </Typography>
                  </ThemeProvider>
                  <div style={{ textAlign: 'end', marginTop: 20 }}>
                    <Button variant='contained'>Learn More</Button>
                  </div>
                </Box>
              </Zoom>
            </Grid>
            {/* <Grid item md={6} xs={12} pt={10} display='flex' justifyContent='center' alignItems='center'>
              <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
                <Box
                  sx={{
                    p: 0,
                    m: 0,
                    mt: 10,
                    borderRadius: 15,
                    textAlign: 'center'
                  }}
                >
                  <video
                    style={{ width: '60%', borderRadius: 15 }}
                    autoPlay
                    loop
                    muted
                    poster='https://assets.codepen.io/6093409/river.jpg'
                  >
                    <source src='https://assets.codepen.io/6093409/river.mp4' type='video/mp4' />
                  </video>
                </Box>
              </Zoom>
            </Grid> */}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default FirstSection
