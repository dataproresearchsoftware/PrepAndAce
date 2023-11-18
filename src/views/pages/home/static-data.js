import { Chip } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { dateconvert } from 'src/@core/utils'

export const courseVideos = [
  {
    course_id: 1,
    sno: 1,
    video_path: 'https://assets.codepen.io/6093409/river.mp4',
    video_length: '0.07 minuets',
    status: 'Y'
  },
  {
    course_id: 1,
    sno: 2,
    video_path: 'https://assets.codepen.io/6093409/river.mp4',
    video_length: '0.07 minuets',
    status: 'Y'
  },
  {
    course_id: 1,
    sno: 3,
    video_path: 'https://assets.codepen.io/6093409/river.mp4',
    video_length: '0.07 minuets',
    status: 'Y'
  }
]

export const courseList = [
  {
    courseId: 1,
    courseTitle: 'Cyber Security',
    description:
      'Whether you are just starting in the field or looking to enhance your current skills, this course will give solid understanding of cybersecurity principles, best practices.and skills necessary to become a cybersecurity expert.',
    duration: '3 Months',
    fee: '$10',
    imagePath: '/images/courses/243@2x.webp',
    parent_id: '',
    active: true
  },
  {
    courseId: 2,
    courseTitle: 'Data Science',
    description:
      'Want to become a data scientist? But not know how and where to start? learn, explore and apply the core fundamentals in data science for machine learning / deep learning / neural networks and set up the foundation for your future career',
    duration: '3 Months',
    fee: '$10',
    imagePath: '/images/courses/280@2x.jpg',
    parent_id: '',
    parent_id: '',
    active: true
  },
  {
    courseId: 3,
    courseTitle: 'C++',
    description:
      'Become a proficient programmer by learning C and C++ programming languages and get hands-on experience with modern C++ which is widely used in today’s software industry.',
    duration: '3 Months',
    fee: '$10',
    imagePath: '/images/courses/275@2x.webp',
    parent_id: '',
    parent_id: '',
    active: true
  }
]
