import { decUserData } from 'src/@core/utils'

export const API_URL = Object.freeze({
  LOGIN: 'up',
  TOKEN_VERIFY: 'auth',
  PERMISSIONS: 'per',
  NAVIGATION: 'nav',

  // ----------GL END POINTS---------- //
  GET_LEVEL1: 'l1',
  UPDATE_LEVEL1: 'l1/upd_l1',
  DELETE_LEVEL1: 'l1/del_l1',

  GET_LEVEL2: 'l2',
  UPDATE_LEVEL2: 'l2/upd_l2',
  DELETE_LEVEL2: 'l2/del_l2',

  GET_ACCOUNT: 'ac',
  UPDATE_ACCOUNT: 'ac/upd_ac',
  DELETE_ACCOUNT: 'ac/del_ac',

  GET_VOUCHER_TYPE: 'vt',
  UPDATE_VOUCHER_TYPE: 'vt/upd_vt',
  DELETE_VOUCHER_TYPE: 'vt/del_vt',

  GET_GL_TRANSACTIONS: 'tm',
  UPDATE_GL_TRANSACTIONS: 'tm/upd_tm',
  DELETE_GL_TRANSACTIONS: 'tm/del_tm',

  GET_GL_ACCOUNT_TRANSACTIONS: 'atrans',
  GET_GL_ACCOUNT_BALANCE: 'abal',
  GET_GL_ACCOUNT_LEDGER: 'aled',
  GET_GL_LEDGER: 'led',
  GET_GL_TRIAL_BALANCE: 'ptb',

  // ----------INVENTORY END POINTS---------- //

  GET_ITEM_TYPE: 'it',
  UPDATE_ITEM_TYPE: 'it/upd_it',
  DELETE_ITEM_TYPE: 'it/del_it',

  GET_ITEM_MAST: 'im',
  UPDATE_ITEM_MAST: 'im/upd_im',
  DELETE_ITEM_MAST: 'im/del_im',

  GET_PURCHASE: 'pm',
  UPDATE_PURCHASE: 'pm/upd_pm',
  DELETE_PURCHASE: 'pm/del_pm',

  GET_SALES: 'sm',
  UPDATE_SALES: 'sm/upd_sm',
  DELETE_SALES: 'sm/del_sm',

  GET_SUPPLIER: 'sup',
  UPDATE_SUPPLIER: 'sup/upd_sup',
  DELETE_SUPPLIER: 'sup/del_sup',

  GET_CUSTOMER: 'cus',
  UPDATE_CUSTOMER: 'cus/upd_cus',
  DELETE_CUSTOMER: 'cus/del_cus',

  COUNTRY: 'country',
  CITY: 'city',
  REGISTRATION: 'registration',
  COURSE_LIST: 'course_list',
  COURSE_VIDEO_DETAILS: 'course_detail',
  CURRENCY: 'https://api.currencyapi.com/v3/latest?apikey=cur_live_eQ09On4jo6KBSpmmo9C3oynIBDdIeJ3ThoRT9JSs',

  UPDATE_SEEN_POINT: 'update_seen_point',
  VIDEO_COMPLETED: 'video_completed'
})
