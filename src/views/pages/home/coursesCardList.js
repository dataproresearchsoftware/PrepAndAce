import { useEffect, useState } from 'react'
import { getCourseListAPI } from 'src/configs'
import { useRouter } from 'next/router'
import FallbackSpinner from 'src/@core/components/spinner'

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
  Box,
  Container
} = require('@mui/material')

export const CourseCardList = () => {
  const [courseList, setCourseList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialized = async () => {
    setIsLoading(true)
    await getCourseListAPI()
      .then(response => {
        setCourseList(response.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    initialized()
  }, [])

  return (
    <Box sx={{ p: 10 }}>
      <Container>
        {isLoading ? (
          <FallbackSpinner />
        ) : (
          <Grid container spacing={10}>
            {courseList?.map(item => (
              <Grid key={item.courseId} item md={3} sm={6} xs={12}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardActionArea sx={{ height: 400 }}>
                    <Box width='100%' textAlign='center'>
                      <img src={item.imagePath} alt={item.courseTitle} style={{ maxWidth: '90%', maxHeight: 100 }} />
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='div'>
                        {item.courseTitle}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.shortDescription ??
                          (item.description.length > 180
                            ? `${item.description.substring(1, 150)}...`
                            : item.description)}
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
        )}
      </Container>
    </Box>
  )
}
