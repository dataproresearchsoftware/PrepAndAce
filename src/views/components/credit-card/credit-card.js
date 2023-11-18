import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'
import PropTypes from 'prop-types'
import Payment from 'payment'

export const CreditCardTextInput = forwardRef(function CreditCardTextInput(props, ref) {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='0000 0000 0000 0000'
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

CreditCardTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export const CardExpiryTextInput = forwardRef(function CardExpiryTextInput(props, ref) {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='00/00'
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

CardExpiryTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export const CardCVCTextInput = forwardRef(function CardCVCTextInput(props, ref) {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={Payment.fns.cardType(props.value) === 'amex' ? '0000' : '000'}
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={value => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

CardCVCTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
