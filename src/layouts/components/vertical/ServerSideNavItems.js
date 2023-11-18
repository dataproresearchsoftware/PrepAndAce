// ** React Imports
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { decUserData } from 'src/@core/utils'

// ** Axios Import
import { API_URL, axios } from 'src/configs'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState([])
  const userDetail = decUserData(window.localStorage.getItem('userData'))
  const { id, token } = JSON.parse(userDetail)

  useEffect(() => {
    axios
      .get(`${API_URL.NAVIGATION}?userid=${id}&token=${token}`)
      .then(response => {
        let menu = []
        let menuArray = response?.data.data
        menuArray = menuArray.map(row => ({
          ...row,
          key: row.form_id
        }))
        const navLevel1 = menuArray.filter(i => i.parent_id === null)
        for (let a = 0; a < navLevel1.length; a++) {
          let n1 = navLevel1[a]
          const navLevel2 = menuArray.filter(i => i.parent_id === n1.form_id)
          if (navLevel2.length) {
            n1 = { ...n1, children: navLevel2 }
          }
          menu.push(n1) // = { ...menu, ...n1 }
          menu = menu.length ? menu : [menu]

          //----------------------------------------------------------------//
          for (let b = 0; b < navLevel2.length; b++) {
            let n2 = navLevel2[b]
            let nl1 = menu.filter(i => i.form_id === n2.parent_id)
            const navLevel3 = menuArray.filter(i => i.parent_id === n2.form_id)
            if (navLevel3.length) {
              n2 = { ...n2, children: navLevel3 }
            }
            nl1[a] = n2

            menu[a].children[b] = nl1[a]
          }
        }
        setMenuItems(menu)
      })
      .catch(err => {
        toast.error(err.message)
      })
  }, [userDetail, id, token])

  return { menuItems }
}

export default ServerSideNavItems
