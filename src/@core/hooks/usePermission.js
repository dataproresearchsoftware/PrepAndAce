import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import fetchPermissions from 'src/store/permissions'
import { useRouter } from 'next/router'

// ** React
const usePermission = () => {
  const [permissions, setPermissions] = useState([])
  const location = useRouter()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchPermissions({ page: location.pathname })).then(resp => {
      const data = resp?.payload?.permission
      const arr = data?.split(',')
      setPermissions(arr)
    })
  }, [dispatch, location.pathname])

  return permissions
}

export default usePermission
