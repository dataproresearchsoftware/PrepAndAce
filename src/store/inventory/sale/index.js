import { getSalesAPI, updateSalesAPI, deleteSalesAPI } from 'src/configs'

export const getSales = async params => {
  const response = await getSalesAPI(params)

  return response?.data
}

export const updateSales = async data => {
  const postResponse = await updateSalesAPI({ data })

  return postResponse
}

export const deleteSales = async data => {
  const postResponse = await deleteSalesAPI({ vcode: data.vcode, vno: data.vno })

  return postResponse
}
