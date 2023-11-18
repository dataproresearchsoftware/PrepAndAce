// ** MUI Imports
import Grid from '@mui/material/Grid'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

import { Box, Button, Toolbar, Typography } from '@mui/material'
import { CourseDetail } from 'src/views/pages/course/courseDetail'

const Course = () => {
  return (
    <>
      <CourseDetail />
    </>
  )
}
Course.guestGuard = true

export default Course
