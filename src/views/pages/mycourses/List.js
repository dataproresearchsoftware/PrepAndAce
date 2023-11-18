// ** MUI Imports

import { Grid, Box, Button, Toolbar, Typography, Card, CardActionArea, CardContent, CardActions } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCourseListAPI } from 'src/configs'

const List = () => {
  const [courseList, setCourseList] = useState([])
  const router = useRouter()

  const initialized = async () => {
    const response = await getCourseListAPI()
    setCourseList(response.data)
  }
  useEffect(() => {
    initialized()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} textAlign='center'>
        <Typography variant='h3'>My Course List</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {courseList.map(item => (
            <Grid
              key={item.courseId}
              item
              md={3}
              sm={6}
              xs={12}
              display='flex'
              justifyContent='center'
              textAlign='center'
            >
              <Card variant='outlined' sx={{ boxShadow: 5, maxWidth: 350 }}>
                <CardActionArea sx={{ height: 400 }}>
                  <Box width='100%' textAlign='center'>
                    <img src={item.imagePath} alt={item.courseTitle} height={100} style={{ maxWidth: 250 }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {item.courseTitle}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.shortDescription ?? item.description}
                    </Typography>
                    <Box display='flex' bottom={0} right={10} p={5} position='absolute'>
                      <Button
                        size='small'
                        variant='outlined'
                        color='info'
                        onClick={() => router.replace(`detail?id=${item.courseId}`)}
                      >
                        Detail
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default List
