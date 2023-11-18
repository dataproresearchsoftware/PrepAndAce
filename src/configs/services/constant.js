import { decUserData } from 'src/@core/utils'

export const setURL = url => {
  const companyCode = JSON.parse(decUserData(window.localStorage.getItem('userData'))).compcode
  const splitURL = url.split('?')
  if (splitURL.length > 1) {
    return `${splitURL[0]}/${companyCode}?${splitURL[1]}`
  } else {
    return `${url}/${companyCode}`
  }
}

let userDetail = null
try {
  userDetail = window !== undefined && decUserData(window.localStorage.getItem('userData'))
} catch (error) {
  userDetail = null
}
userDetail = userDetail && JSON.parse(userDetail)

export const deleteParams = params => {
  const companyCode = JSON.parse(decUserData(window.localStorage.getItem('userData'))).compcode

  return { ...params, compcode: companyCode, userid: userDetail.id }
}

export const updateParams = params => {
  const data = params.data
  const companyCode = JSON.parse(decUserData(window.localStorage.getItem('userData'))).compcode

  return { ...params, data: { ...data, compcode: companyCode, userid: userDetail.id } }
}

export const purchaseVoucherType = process.env.NEXT_PUBLIC_PURCHASE_VOUCHER_TYPE

export const salesVoucherType = process.env.NEXT_PUBLIC_SALES_VOUCHER_TYPE

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos - 1) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
