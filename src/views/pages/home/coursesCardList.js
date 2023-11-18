import { useEffect, useState } from 'react'
import { getCourseListAPI } from 'src/configs'
import { useRouter } from 'next/router'

const {
  Card,
  Grid,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  CardActionArea,
  Box
} = require('@mui/material')

export const CourseCardList = () => {
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
    <Box sx={{ p: 10 }}>
      <Grid container spacing={10}>
        {courseList.map(item => (
          <Grid key={item.courseId} item md={3} sm={6} xs={12}>
            <Card sx={{ maxWidth: 400 }}>
              <CardActionArea sx={{ height: 400 }}>
                <Box width='100%' textAlign='center'>
                  <img src={item.imagePath} alt={item.courseTitle} height={100} />
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
                      color='primary'
                      onClick={() => router.replace(`course?id=${item.courseId}`)}
                    >
                      See Detail
                    </Button>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
