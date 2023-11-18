import {
  getAccountBalanceAPI,
  getAccountLedgerAPI,
  getAccountTransactionsAPI,
  getLedgerAPI,
  getTrialBalanceAPI
} from 'src/configs'

export const getAccountBalance = async params => {
  const accountTransactionResponse = await getAccountTransactionsAPI(params)
  const accountBalanceResponse = await getAccountBalanceAPI(params)

  return { accountTransaction: accountTransactionResponse.data, accountBalance: accountBalanceResponse.data }
}

// export const getAccountTransactions = async params => {
//   const response = await getAccountTransactionsAPI(params)

//   return response?.data
// }

export const getAccountLedger = async params => {
  let index = 0
  let lastTotal = 0
  const accountLedgerResponse = await getAccountLedgerAPI({ acode: params.acode, startdate: params.startdate })
  const ledgerResponse = await getLedgerAPI(params)
  const accountLedgerData = accountLedgerResponse.data
  const ledgerData = ledgerResponse.data

  ledgerData.items.forEach(item => {
    if (index === 0) {
      const opn =
        accountLedgerData.data[0].jsons.odr - accountLedgerData.data[0].jsons.ocr + lastTotal + item.amtdr - item.amtcr
      item['balance'] = Math.round(opn)
      lastTotal = opn
    } else {
      item['balance'] = Math.round(lastTotal + item.amtdr - item.amtcr)
      lastTotal = lastTotal + item.amtdr - item.amtcr
    }

    index = index + 1
  })

  return { accountLedgerData: accountLedgerData.data[0].jsons, ledgerData: ledgerData.items }
}

export const getLedger = async params => {
  const response = await getLedgerAPI(params)

  return response?.data
}

// export const getTrialBalance = async params => {
//   const response = await getTrialBalanceAPI(params)

//   return response?.data
// }
