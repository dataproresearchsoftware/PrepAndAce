import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'
import Spinner from 'src/@core/components/spinner'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'

import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import Error401 from 'src/pages/401'
import { isAllowed } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayoutAppBar from 'src/@core/layouts/components/blank-layout-with-appBar'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const UserLayout = ({ children, contentHeightFixed }) => {
  const location = useRouter()
  const { user } = useAuth()

  // ** Hooks
  const permission = usePermission()
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState([])
  useEffect(() => {
    // setIsLoading(true)
    setIsLoading(false)
    setPermissions(permission)
    if (isAllowed(permissions, 'R')) {
      setIsLoading(false)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission])
  const { settings, saveSettings } = useSettings()

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()

  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
  // const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  // if (hidden && settings.layout === 'horizontal') {
  //   settings.layout = 'vertical'
  // }

  return user?.user_type === 'A' ? (
    <BlankLayout>
      {isLoading ? (
        <Spinner />
      ) : isAllowed(permissions, 'R') ||
        location.pathname === '/' ||
        location.pathname === '/home' ||
        location.pathname === '/registration' ||
        location.pathname === '/course' ? (
        children
      ) : (
        <Error401 />
      )}
    </BlankLayout>
  ) : (
    <BlankLayoutWithAppBar>
      {isLoading ? (
        <Spinner />
      ) : isAllowed(permissions, 'R') ||
        location.pathname === '/' ||
        location.pathname === '/home' ||
        location.pathname === '/registration' ||
        location.pathname === '/course' ? (
        children
      ) : (
        <Error401 />
      )}
    </BlankLayoutWithAppBar>
  )
}

export default UserLayout
