// ** Third Party Imports
import DatePicker from 'react-datepicker'
import CustomInput from './PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CustomDatePickers = ({ popperPlacement, title, date, setDate }) => {
  return (
    <DatePickerWrapper>
      <DatePicker
        selected={date}
        id='basic-input'
        popperPlacement={popperPlacement}
        onChange={date => setDate(date)}
        placeholderText='Click to select a date'
        customInput={<CustomInput label={title} />}
      />
    </DatePickerWrapper>
  )
}

export default CustomDatePickers
