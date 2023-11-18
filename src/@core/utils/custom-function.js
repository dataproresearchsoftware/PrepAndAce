import createCache from '@emotion/cache'
import axios from 'axios'
import { format, differenceInDays, addDays } from 'date-fns'

export const createEmotionCache = () => {
  return createCache({ key: 'css' })
}

export const getDateRange = (startDate, endDate) => {
  const days = differenceInDays(endDate, startDate)

  return [...Array(days + 1).keys()].map(i => format(addDays(startDate, i), 'MM/dd/yyyy'))
}

export const isAllowed = (permissions, value) => {
  const f = permissions?.find(i => i === value)

  return f === value
}

// ** Returns initials from string
export const getInitials = string => string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

/**
 ** Hex color to RGBA color
 */
export const hexToRGBA = (hexCode, opacity) => {
  let hex = hexCode.replace('#', '')
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const isFloat = n => {
  return typeof n === 'number' && n % 1 !== 0
}

/**
 ** RGBA color to Hex color with / without opacity
 */
export const rgbaToHex = (rgba, forceRemoveAlpha = false) => {
  return (
    '#' +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
      .join('')
  )
}

export function amountWithComma(n) {
  if (n !== null) {
    return n?.toLocaleString() ?? '0'
  } else {
    return n
  }
}

export function validatePercentage(val) {
  try {
    const allowChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
    const valueArry = val.toString().split('')

    let validatevalue = val
    let isValid = false
    for (let i2 = 0; i2 < valueArry.length; i2++) {
      for (let i1 = 0; i1 < allowChar.length; i1++) {
        if (allowChar[i1] === valueArry[i2].toString()) {
          isValid = true
          break
        }
      }
      if (!isValid) {
        validatevalue = validatevalue.replace(valueArry[i2], '')
      }
    }
    const value = validatevalue
    if (value < 0) return 0
    else if (value > 100) return 100
    else if (value >= 0 && value <= 100) {
      const valuelength = value.length - 1
      if (value.length > 1) {
        const firstValue = value.substring(0, 1)
        const secondValue = value.substring(1, 2)
        if (firstValue === '0' && secondValue !== '.') {
          return value.substring(1, value.length)
        }
      }
      const dotIndex = value.lastIndexOf('.')
      if (dotIndex) {
        const decimalPlaces = value.substring(dotIndex, valuelength).length
        if (decimalPlaces > 2) {
          return value.substring(0, value.toString().length - 1)
        } else if (dotIndex === valuelength) {
          return value.replace('..', '.')
        }
      }

      return val
    } else return 0
  } catch {
    return val.substring(0, val.toString().length - 1)
  }
}

export const getQueryStringParams = query => {
  return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
    const [key, value] = param.split('=')
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''

    return params
  }, {})
}

export const amountInWords = number => {
  const first = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen '
  ]
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const mad = ['', 'thousand', 'million', 'billion', 'trillion']
  let word = ''

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i))
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = `${first[Math.floor(tempNumber / Math.pow(1000, i))]}${mad[i]} ${word}`
      } else {
        word = `${tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))]}-${
          first[Math.floor(tempNumber / Math.pow(1000, i)) % 10]
        }${mad[i]} ${word}`
      }
    }

    tempNumber = number % Math.pow(1000, i + 1)
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = `${first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))]}hunderd ${word}`
  }

  return word && `${word} only`
}

export const dateconvert = (data, format = 'dd-mm-yyyy') => {
  const getMonth2Digits = value => {
    const mm = `0${value}`

    return mm.substring(mm.length - 2, mm.length)
  }

  if (data) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const today = new Date(data)
    const dd = String(today.getDate()).padStart(2, '0')
    const mmW = monthNames[today.getMonth()] //January is 0!
    const mm = getMonth2Digits(today.getMonth() + 1) //January is 0!
    const yyyy = today.getFullYear()
    if (format === 'dd-mm-yyyy') {
      return `${dd}-${mmW}-${yyyy}`
    } else if (format.toLowerCase() === 'yyyymmdd') {
      return `${yyyy}${mm}${dd}`
    }
  } else {
    return ''
  }
}

export function jsonToQueryString(json) {
  return (
    '?' +
    Object.keys(json)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
      .join('&')
  )
}

export const getValueFromOptions = (options, value) => {
  const option = options.find(object => object.value === value)

  return option === undefined ? '' : option
}

export const escapeRegExp = value => {
  return value?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export const setRedirectUrl = ({ url, data }) => {
  return `${url}${jsonToQueryString(data)}`
}

export const handleSearch = ({ value, data, setSearchStates }) => {
  const searchRegex = new RegExp(escapeRegExp(value), 'i')

  const filteredRows = data.filter(row => {
    return Object.keys(row).some(field => {
      // @ts-ignore

      return searchRegex.test(row[field] === null ? '' : row[field].toString())
    })
  })
  if (value?.length) {
    setSearchStates({ filteredData: filteredRows, searchText: value })
  } else {
    setSearchStates({ filteredData: [], searchText: value })
  }
}

export const imageUrl = ({ preFix = '', url = '' }) =>
  `${window.location.origin}/images${preFix.length > 0 ? `/${preFix}` : ''}/${url}`
