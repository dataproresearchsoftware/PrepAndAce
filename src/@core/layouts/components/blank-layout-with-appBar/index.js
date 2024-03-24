import * as React from 'react'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getCourseListAPI, themeConfig } from 'src/configs'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { decUserData } from 'src/@core/utils'

import { useAuth } from 'src/hooks/useAuth'
import Icon from 'src/@core/components/icon'

const drawerWidth = 240

const navItems = [
  { sno: 1, title: 'Home', path: '/home' },
  { sno: 2, title: 'Course', path: '/home/#courses', path2: '/mycourses/list' },
  { sno: 3, title: 'Apply for job', path: '' },
  {
    sno: 4,
    title: 'Join',
    path: '',
    children: [
      { sno: 1, title: 'Login', path: '/login' },
      { sno: 2, title: 'Registration', path: '/registration' }
    ]
  }
]

function BlankLayoutAppBar(props) {
  const { logout, user } = useAuth()

  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  // const [courseList, setCourseList] = React.useState([])

  // const initialized = async () => {
  //   const response = await getCourseListAPI()
  //   setCourseList(response.data)
  // }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item, index) => (
          <ListItem key={`${item.sno}-${index}`}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.title} onClick={() => router.push(item.path)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <AppBar component='nav' sx={{ backgroundColor: '#ffffff80' }}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <img src={'/images/logo.png'} style={{ marginTop: 10 }} height='70' alt={''} />
          <Typography variant='h4' color='GrayText' component='div' sx={{ flexGrow: 1 }}>
            PrepAndAce
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item, index) => {
              {
                if (item?.children) {
                  return (
                    <>
                      <Button
                        key={`btn-${item.sno}-${index}`}
                        sx={{ color: 'GrayText' }}
                        id={`basic-menu-${item.sno}`}
                        aria-controls={open ? `basic-menu-${item.sno}` : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        {user && item.sno === 4 ? <Icon icon='tabler:user-circle' /> : item.title}
                      </Button>
                      <Menu
                        key={`menu-${item.sno}-${index}`}
                        id={`basic-menu-${item.sno}`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => {
                          handleClose()
                          router.push(item.path)
                        }}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                      >
                        {user && item.sno === 4 ? (
                          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                        ) : (
                          item?.children.map(i => {
                            return (
                              <MenuItem key={`mi-${i.sno}-${index}`} onClick={() => router.push(i.path)}>
                                {i.title}
                              </MenuItem>
                            )
                          })
                        )}
                      </Menu>
                    </>
                  )
                } else {
                  return user && item.sno === 3 ? null : (
                    <Button
                      key={`bb-${item.sno}-${index}`}
                      sx={{ color: 'GrayText' }}
                      onClick={() => router.push(user && item.sno === 2 ? item.path2 : item.path)}
                    >
                      {item.title}
                    </Button>
                  )
                }
              }
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  )
}

BlankLayoutAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
}

export default BlankLayoutAppBar
