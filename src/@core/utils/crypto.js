import AES from 'crypto-js/aes'
import { enc } from 'crypto-js'

const key = process.env.NEXT_PUBLIC_SECRET

const encryptId = str => {
  const ciphertext = AES.encrypt(str, key)

  return encodeURIComponent(ciphertext.toString())
}

const decryptId = str => {
  const decodedStr = decodeURIComponent(str)

  return AES.decrypt(decodedStr, key)?.toString(enc.Utf8)
}

export const encUserData = data => {
  return data && encryptId(JSON.stringify(data))
}

export const decUserData = data => {
  return data && decryptId(data)
}

export const encParams = data => {
  return data && encryptId(JSON.stringify(data))
}

export const decParams = data => {
  return data && JSON.parse(decryptId(data))
}
