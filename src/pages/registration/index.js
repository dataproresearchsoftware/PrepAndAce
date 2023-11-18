// ** MUI Imports
import BlankLayout from 'src/@core/layouts/BlankLayout'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

import { Form } from 'src/views/pages/registration/form'

const Registration = (amountPKR = 0) => {
  return <Form amountPKR={amountPKR} isForm={true} />
}

Registration.guestGuard = true

export default Registration
