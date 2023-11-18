// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import level1 from './gl/chart-of-account/level1'
import level2 from './gl/chart-of-account/level2'
import account from './gl/chart-of-account/account'
import voucherType from './gl/vouchertype'
import item from './inventory/item'
import itype from './inventory/itype'
import supplier from './inventory/supplier'
import customer from './inventory/customer'

export * from './navigation/vertical'

export * from './permissions'

export * from './gl/chart-of-account/level1'

export * from './gl/chart-of-account/level2'

export * from './gl/chart-of-account/account'

export * from './gl/vouchertype'

export * from './gl/transactions'

export * from './gl/reports'

export * from './inventory/item'

export * from './inventory/itype'

export * from './inventory/supplier'

export * from './inventory/purchase'

export * from './inventory/customer'

export * from './inventory/sale'

export const store = configureStore({
  reducer: {
    level1,
    level2,
    account,
    voucherType,
    itype,
    item,
    supplier,
    customer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
