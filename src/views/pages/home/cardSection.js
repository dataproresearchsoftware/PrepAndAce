// ** MUI Imports
import Grid from '@mui/material/Grid'

import { Box, Button, Card, Divider, Toolbar, Typography } from '@mui/material'
import { CourseCardList } from './coursesCardList'

const CardSection = () => {
  return (
    <>
      <Divider sx={{ pb: 20, bgcolor: '#cfdefc', border: 'none' }} id='courses' />{' '}
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <Grid container sx={{ bgcolor: '#cfdefc' }}>
              <Grid item xs={12} pt={5}>
                <Typography variant='h4' textAlign='center'>
                  Gateway to a bright future. <br />
                  Study in Germany.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CourseCardList />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default CardSection
