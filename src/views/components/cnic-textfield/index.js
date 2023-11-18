import Cleave from 'cleave.js/react'

export const CNICTextField = props => {
  const { options, inputRef, ...other } = props

  return <Cleave {...other} ref={inputRef} options={{ delimiters: ['-', '-'], blocks: [5, 7, 1], uppercase: true }} />
}
