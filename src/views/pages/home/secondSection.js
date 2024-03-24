// ** MUI Imports
import Grid from '@mui/material/Grid'
import Zoom from '@mui/material/Zoom'

import { Box, Button, Toolbar, Typography } from '@mui/material'

const SecondSection = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ width: '100%', bgcolor: '#0332cb' }}>
          <Grid container>
            <Grid item lg={5} xs={12}>
              <img style={{ height: 630, width: '100%' }} src='/images/176_2x.webp' alt='' />
            </Grid>
            <Grid item md={7} xs={12} pt={10}>
              <Box sx={{ pl: 20, maxWidth: 600 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant='h4' textAlign='left' color='#fdfeff'>
                      Gateway to a bright future.
                    </Typography>
                    <Typography variant='h4' textAlign='left' color='#fdfeff'>
                      Study in Germany.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6' pt={5} color='#fdfeff' sx={{ fontFamily: 'Roboto' }}>
                      Looking for higher education in the most prestigious German universities, while working and
                      earning for your tuition fees.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6' pt={5} color='#fdfeff' sx={{ fontFamily: 'Roboto' }}>
                      PrepAndAce helps you in getting admissions to reputed public and private universities.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6' pt={5} color='#fdfeff' sx={{ fontFamily: 'Roboto' }}>
                      PrepAndAce teaches you German language skills upto B-2 level, opening the doors for admission to
                      unlimited universities, with lowest fees that demand proficiency in language.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6' pt={5} color='#fdfeff' sx={{ fontFamily: 'Roboto' }}>
                      PrepAndAce also helps you in getting work permit during course of study, residence, insurance,
                      after study job placement and permanent settlement in Germany.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SecondSection
