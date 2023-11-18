import { getPurchaseAPI, updatePurchaseAPI, deletePurchaseAPI } from 'src/configs'

export const getPurchase = async params => {
  const response = await getPurchaseAPI(params)

  return response?.data
}

export const updatePurchase = async data => {
  const postResponse = await updatePurchaseAPI({ data })

  return postResponse
}

export const deletePurchase = async data => {
  const postResponse = await deletePurchaseAPI({ vcode: data.vcode, vno: data.vno })

  return postResponse
}
