// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import { API_URL, axios } from 'src/configs'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState([])
  useEffect(() => {
    axios.get(`${API_URL.NAVIGATION}?userid=1`).then(response => {
      const menuArray = response.data
      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
