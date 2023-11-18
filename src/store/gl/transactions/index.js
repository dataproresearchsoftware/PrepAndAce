import { getGLTransactionsAPI, updateGLTransactionsAPI, deleteGLTransactionsAPI } from 'src/configs'

export const getGLTransactions = async params => {
  const response = await getGLTransactionsAPI(params)

  return response?.data
}

export const updateGLTransactions = async data => {
  const postResponse = await updateGLTransactionsAPI({ data })

  return postResponse
}

export const deleteGLTransactions = async data => {
  const postResponse = await deleteGLTransactionsAPI({ vcode: data.vcode, vno: data.vno })

  return postResponse
}

//export default getGLTransactions
