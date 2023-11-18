// ** MUI Imports

import { Grid, Box, Button, Toolbar, Typography, Zoom, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { getCourseListAPI, getCourseVideoDetailsAPI, postUpdateSeenPointAPI, postVideoCompletedAPI } from 'src/configs'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import LinearProgress from '@mui/material/LinearProgress'
import { green } from '@mui/material/colors'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'

export const CourseDetail = () => {
  const [courseData, setCourseData] = useState([])
  const [video, setVideo] = useState()
  const [videoPlayed, setVideoPlayed] = useState(0)
  const [courseVideoList, setCourseVideoList] = useState([])
  const router = useRouter()

  const initialized = async () => {
    const { id } = router?.query

    const course = await getCourseListAPI({ courseId: id })
    const courseVideoData = await getCourseVideoDetailsAPI({ courseId: 1, active: 'true' })
    setCourseData(course?.data[0])
    setCourseVideoList(courseVideoData.data)
    const data = courseVideoData.data.find(i => i.isPlay === true)
    const curr_video = data ?? courseVideoData.data[0]
    console.log('curr_video', curr_video)

    setVideo(curr_video)
    let vid = document.getElementById('courseVideo')
    vid.currentTime = curr_video.seenPoint === curr_video.video_length ? 0 : curr_video.seenPoint
  }
  useEffect(() => {
    initialized()
  }, [])

  const setCurrentVideo = sno => {
    const data = courseVideoList.find(i => i.sno === sno)
    setVideo(data)
    let vid = document.getElementById('courseVideo')
    const currentTime = data.seenPoint === data.video_length ? 0 : data.seenPoint
    vid.currentTime = currentTime
    setVideoPlayed(currentTime)
  }

  const handleTimeUpdate = async event => {
    if (parseFloat(event.target.currentTime) > parseFloat(videoPlayed) + 1) {
      setVideoPlayed(event.target.currentTime)
      const { id } = router?.query
      video.seenPoint = Math.round(parseFloat(event.target.currentTime))

      const resp = await postUpdateSeenPointAPI({
        data: {
          courseId: parseInt(id),
          sno: video.sno,
          seenPoint: Math.round(parseFloat(event.target.currentTime))
        },
        config: { skipToast: true }
      })
    }
  }

  const handleCompleted = async event => {
    const { id } = router?.query
    video.seenPoint = video.video_length

    const resp = await postVideoCompletedAPI({
      data: {
        courseId: parseInt(id),
        sno: video.sno,
        seenPoint: Math.round(parseFloat(video.video_length))
      },
      config: { skipToast: true }
    })

    console.log('resp?.data', resp?.data)
    setVideo(resp?.data)
    setVideoPlayed(0)

    const updateCourseVideoList = courseVideoList.map(item => {
      if (item.sno === resp?.data.sno) {
        return resp?.data
      } else if (item.sno === video.sno) {
        return { ...item, isPlay: false }
      } else {
        return item
      }
    })
    setCourseVideoList(updateCourseVideoList)
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} textAlign='center' borderBottom={1}>
          <Typography variant='h5' my={2}>
            {courseData?.courseTitle}
          </Typography>
        </Grid>
        <Grid item md={8} xs={12} pt={10}>
          <Grid container>
            <Grid item xs={12} textAlign='center'>
              <Typography variant='h5' my={2}>
                {video?.title}
              </Typography>
              <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
                <Box
                  sx={{
                    p: 0,
                    m: 0,
                    borderRadius: 15,
                    textAlign: 'center'
                  }}
                >
                  <video
                    id='courseVideo'
                    name='courseVideo'
                    style={{ width: '80%', borderRadius: 15 }}
                    controls
                    controlsList='nodownload'
                    poster={video?.poster}
                    onseeking={handleTimeUpdate}
                    onEnded={handleCompleted}
                    onTimeUpdate={handleTimeUpdate}
                    src={video?.video_path}
                  ></video>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
          sx={{ bgcolor: '#ffffff0f', maxHeight: '85vh', overflowY: 'scroll' }}
          textAlign='center'
        >
          {courseVideoList?.map((item, index) => (
            <Grid container key={`${item.sno}-${index}`}>
              <Grid item xs={12} p={5} textAlign='left'>
                <Button
                  fullWidth
                  style={{ padding: 0, margin: 0, textAlign: 'left' }}
                  onClick={() => item.status > 0 && setCurrentVideo(item.sno)}
                >
                  <Card
                    variant='outlined'
                    sx={{ width: '100%', m: 2, p: 2, backgroundColor: item.isPlay && green[400] }}
                  >
                    <Grid container>
                      <Grid item xs={9}>
                        <Typography variant='subtitle1'>
                          {index + 1}. {item.title}
                        </Typography>
                        <Typography variant='subtitle2' display='flex' alignItems='center'>
                          <Icon icon='tabler:clock-filled' style={{ fontSize: 20, paddingRight: 5 }} />
                          {item.video_length} sec
                        </Typography>
                      </Grid>
                      <Grid item xs={3} display='flex' justifyContent='end' alignItems='center'>
                        <Icon icon={`tabler:${item.status === 0 ? 'lock' : 'lock-open'}`} textAlign='right' />
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          title={item.seenPoint}
                          variant='determinate'
                          value={Math.round((item.seenPoint * 100) / item.video_length)}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} textAlign='center' borderBottom={1}>
          <Grid item xs={12}>
            <Grid container>
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
                            {courseData?.courseSubject?.map((item, index) => (
                              <Grid key={`${item.sno}-${index}`} item sm={6} textAlign='left'>
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
                      {courseData?.longDescription?.learnKeys.map((item, index) => (
                        <Grid container key={`${item.sno}-${index}`}>
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
                      {courseData?.longDescription?.includedInCourse?.map((item, index) => (
                        <Grid container key={`${item.sno}-${index}`}>
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
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default CourseDetail
