import { blue, green, grey } from '@mui/material/colors'
import { courseList, courseVideos } from '../home/static-data'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { getCourseListAPI } from 'src/configs'
import PaymentModal from 'src/views/components/modal/payment-modal'
import { Modal } from 'src/views/components'
import { Form } from '../registration/form'
import axios from 'axios'
import { API_URL } from 'src/configs'
import { amountWithComma } from 'src/@core/utils'

const {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
  ButtonGroup,
  TextField,
  IconButton,
  Pagination
} = require('@mui/material')

export const CourseDetail = () => {
  const [courseData, setCourseData] = useState([])
  const [isAllowed, setIsAllowed] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [isRegOpen, setIsRegOpen] = useState(false)
  const videosLength = courseVideos.length
  const router = useRouter()

  const handlePageChange = (event, value) => {
    setPage(value)
    getVideoDetail(router.query?.id, value)
  }

  const onBuy = () => {
    setIsAllowed(true)
    getVideoDetail(router.query?.id, 1)
    toast.success('You Request has been sent!')
  }

  useEffect(() => {
    getVideoDetail(router.query?.id, 1)
  }, [router.query])

  const getVideoDetail = async (course_id, sno) => {
    let course = await getCourseListAPI({ courseId: course_id })
    const currencyList = await axios(API_URL.CURRENCY)
    const PKR = currencyList.data.data.PKR.value
    const newCourse = await course.data.map(item => ({ ...item, rate: PKR, feePKR: Math.round(item.fee * PKR) }))
    setCourseData(newCourse[0])
    setCurrentVideo(courseVideos.find(i => i.course_id === newCourse[0]?.courseId && i.sno === sno))
    setPage(1)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card sx={{ m: 10 }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card sx={{ p: 5 }}>
                <Typography variant='h3' pt={2} textAlign='center'>
                  {courseData?.courseTitle}
                </Typography>
                <Typography variant='h6' textAlign='center' sx={{ fontSize: 12, fontStyle: 'italic' }}>
                  {courseData?.subTitle}
                </Typography>
                <Box textAlign='center' pt={2}>
                  <img
                    src={courseData?.imagePath}
                    alt={courseData?.courseTitle}
                    height={140}
                    width={140}
                    style={{ borderRadius: '50%' }}
                  />
                </Box>

                <Grid item xs={12} display='flex' justifyContent='center'>
                  <Card
                    sx={{ p: 5, m: 5, boxShadow: 10, background: '#ffffff17', maxWidth: 1000 }}
                    variant='outlined'
                    display='flex'
                    justifyContent='center'
                  >
                    <Box textAlign='center' pt={2}>
                      <Typography variant='h5' textAlign='center' mb={5}>
                        What you will learn in this course
                      </Typography>

                      <Box>
                        <Grid container spacing={1}>
                          {courseData?.courseSubject?.map(item => (
                            <Grid key={item.sno} item sm={6} textAlign='left'>
                              <Button variant='text' color='info' sx={{ fontSize: 12 }}>
                                <Box textAlign='left'>
                                  <Icon icon='tabler:circle-filled' width={10} style={{ marginRight: 10 }} />
                                  {item.description}
                                </Box>
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} p={5}>
                  <Button>
                    <Box textAlign='left'>
                      <Typography variant='h5'>Who this course is for:</Typography>
                      <Typography variant='subtitle1'>({courseData?.courseFor})</Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12} p={5}>
                  <Button>
                    <Box textAlign='left'>
                      <Typography variant='h5'>Course Requirements:</Typography>
                      <Typography variant='subtitle1'>({courseData?.courseRequirements})</Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12} p={5}>
                  <Box textAlign='left'>
                    <Typography variant='h5'>Description:</Typography>
                    <Typography variant='subtitle1' mt={3}>
                      {courseData?.longDescription?.learnKeyHeading}
                    </Typography>
                    {courseData?.longDescription?.learnKeys.map(item => (
                      <Grid container key={item.sno}>
                        <Grid item xs={12}>
                          <Button variant='text' color='info' sx={{ fontSize: 12 }}>
                            <Box textAlign='left'>
                              <span style={{ fontWeight: 'bold', marginRight: 2 }}>{item.sno}. </span>
                              {item.description}
                            </Box>
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                    <Typography variant='subtitle1' mt={3}>
                      What is included with this course:
                    </Typography>
                    {courseData?.longDescription?.includedInCourse?.map(item => (
                      <Grid container key={item.sno}>
                        <Grid item xs={12}>
                          <Button variant='text' color='info' sx={{ fontSize: 12 }}>
                            <Box textAlign='left'>
                              <span style={{ fontWeight: 'bold', marginRight: 2 }}>{item.sno}. </span>
                              {item.description}
                            </Box>
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Grid>
                <Grid container>
                  <Grid item xs={12} display='flex' justifyContent='center'>
                    <Card
                      sx={{ p: 5, m: 5, boxShadow: 10, background: '#ffffff17', maxWidth: 1000 }}
                      variant='outlined'
                      display='flex'
                      justifyContent='center'
                    >
                      <Box textAlign='center' pt={2}>
                        <Typography variant='h6' textAlign='center' mb={5}>
                          Get access to this and other unlimited courses by paying{' '}
                          <span style={{ color: green[500] }}>
                            US ${courseData?.fee} @ ${courseData?.rate?.toFixed(4)} = PKR{' '}
                            {amountWithComma(courseData?.feePKR)}
                          </span>{' '}
                          per month.
                        </Typography>
                        <Button variant='contained' onClick={() => setIsRegOpen(true)}>
                          Subscribe
                        </Button>
                        <PaymentModal isOpen={isOpen} setIsOpen={setIsOpen} />
                        <Form
                          isOpen={isRegOpen}
                          onClose={() => setIsRegOpen(false)}
                          modelMaxWidth={500}
                          amountPKR={courseData?.feePKR}
                        />
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}
