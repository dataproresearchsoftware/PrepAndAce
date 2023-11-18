import {
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

import { Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

//import { getLevel1, updateLevel1, deleteLevel1 } from 'src/store'
import { toast } from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { genderOptions, maritalStatusOptions } from './static-data'
import { getCityAPI, getCountryAPI, getStudentRegistrationAPI, postStudentRegistrationAPI } from 'src/configs'
import PaymentModal from 'src/views/components/modal/payment-modal'
import axios from 'axios'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'

const pageTitle = 'Registration Form'

const defaultValues = {
  student_id: null,
  student_first_name: '',
  student_middle_name: '',
  student_last_name: '',
  date_of_birth: null,
  gender: null,
  marital_status: null,
  address1: '',
  city: null,
  country: null,
  postal_code: '',
  email_address: '',
  contact_no: '',
  last_qualification: '',
  certifications: ''
}

export const Form = ({ isOpen = true, onClose, modelMaxWidth = 500, amountPKR = 0, isForm = false }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors }
  } = useForm({ defaultValues })
  const router = useRouter()

  const [states, setStates] = useState({
    isEdit: false,
    isSubmit: false
  })
  const [countryOptions, setCountryOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const initialized = async () => {
    //Bind Country 1 List
    const response = await getCountryAPI()
    console.log('Country response', response)
    if (response?.error) {
      toast.error(response.error.message)

      return
    }
    const CountryData = response.data
    setCountryOptions(CountryData.map(item => ({ value: item.iso, label: item.country })))
  }

  useEffect(() => {
    initialized()
  }, [])

  const handleCountryToChange = async data => {
    //Bind City List
    if (data !== null) {
      const response = await getCityAPI({ iso: data?.value })
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
      const cityData = response.data[0].cities

      setCityOptions(cityData.map(item => ({ value: item.id, label: item.city })))
    }
    resetField('city')
  }

  const onSubmit = async data => {
    setStates({ ...states, isSubmit: true })
    console.log('submit')

    const response = await postStudentRegistrationAPI({
      data: {
        student_id: data?.student_id,
        student_first_name: data.student_first_name,
        student_middle_name: data?.student_middle_name,
        student_last_name: data?.student_last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender.value,
        marital_status: data?.marital_status?.value,
        address1: data?.address1,
        city: data.city.value,
        country: data.country.value,
        postal_code: '00000', //data.postal_code,
        email_address: data.email_address,
        contact_no: data.contact_no,
        last_qualification: data?.last_qualification,
        certifications: data?.certifications
      }
    })
    if (response?.data?.acknowledged) {
      const responseData = await getStudentRegistrationAPI({ email_address: data.email_address })

      const getIFrame = await axios.post(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/paymob`, {
        amount: amountPKR,
        payment_type: 'CC',
        email: data.email_address,
        first_name: data.student_first_name,
        last_name: data.student_first_name,
        phone_number: data.contact_no
      })

      //setIsPaymentModalOpen(true)
      if (getIFrame.data) {
        window.localStorage.setItem('merchant_order_id', getIFrame.data.merchant_order_id)
        window.localStorage.setItem('order_id', getIFrame.data.order_id)
        window.localStorage.setItem('email', data.email_address)
        router.replace(getIFrame.data.CardPaymentURL)
      }
    }

    // reset()
    setStates({ ...states, isSubmit: false })
  }

  const submtFrom = () => (
    <>
      {/* <CardHeader title={pageTitle} /> */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3} sx={{ display: 'none' }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Controller
                name='student_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='STUDENT ID'
                    onChange={onChange}
                    placeholder='STUDENT ID'
                    size='small'
                    inputProps={{ maxLength: 5 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='student_first_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='NAME'
                    onChange={onChange}
                    placeholder='NAME'
                    size='small'
                    inputProps={{ maxLength: 30 }}
                    error={Boolean(errors.student_first_name)}
                    helperText={Boolean(errors.student_first_name) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Controller
                name='student_middle_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='MIDDLE NAME'
                    onChange={onChange}
                    placeholder='MIDDLE NAME'
                    size='small'
                    inputProps={{ maxLength: 30 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Controller
                name='student_last_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='LAST NAME'
                    onChange={onChange}
                    placeholder='LAST NAME'
                    size='small'
                    inputProps={{ maxLength: 30 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Controller
                name='date_of_birth'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <ReactDatePicker
                      selected={value}
                      dateFormat='dd-MMM-yyyy'
                      id='date_of_birth'
                      isClearable
                      showMonthDropdown
                      showYearDropdown
                      popperPlacement='auto'
                      onChange={onChange}
                      placeholderText='SELECT DATE'
                      customInput={
                        <TextField
                          fullWidth
                          label='DATE OF BIRTH'
                          placeholder='SELECT DATE'
                          size='small'
                          error={Boolean(errors.date_of_birth)}
                          helperText={Boolean(errors.date_of_birth) && 'Required'}
                        />
                      }
                    />
                  </DatePickerWrapper>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size='small'>
              <Controller
                name='gender'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={genderOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='GENDER'
                          variant='outlined'
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  )
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth size='small'>
              <Controller
                name='marital_status'
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={maritalStatusOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => <TextField {...params} label='MARITAL STATUS' variant='outlined' />}
                    />
                  )
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                rules={{ required: true }}
                name='contact_no'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='CONTACT NO'
                    onChange={onChange}
                    placeholder='CONTACT NO'
                    size='small'
                    inputProps={{ maxLength: 15 }}
                    error={Boolean(errors.contact_no)}
                    helperText={Boolean(errors.contact_no) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='email_address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='email'
                    value={value}
                    label='EMAIL ADDRESS'
                    onChange={onChange}
                    placeholder='xyz@abc.com'
                    size='small'
                    inputProps={{ maxLength: 40 }}
                    error={Boolean(errors.email_address)}
                    helperText={Boolean(errors.email_address) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Controller
                name='last_qualification'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='LAST QUALIFICATION'
                    onChange={onChange}
                    placeholder='Type hare..'
                    size='small'
                    inputProps={{ maxLength: 60 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Controller
                name='certifications'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='CERTIFICATIONS'
                    onChange={onChange}
                    placeholder='Type hare..'
                    size='small'
                    inputProps={{ maxLength: 60 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Controller
                name='address1'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='ADDRESS'
                    onChange={onChange}
                    placeholder='ADDRESS'
                    size='small'
                    inputProps={{ maxLength: 100 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size='small'>
              <Controller
                name='country'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={countryOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => {
                        field.onChange(data)
                        handleCountryToChange(data)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='COUNTRY'
                          variant='outlined'
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  )
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size='small'>
              <Controller
                name='city'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={cityOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='CITY'
                          variant='outlined'
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  )
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} mt={3} display='flex' justifyContent='center'>
            <LoadingButton loading={states.isSubmit} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Register
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
      <PaymentModal isOpen={isPaymentModalOpen} setIsOpen={setIsPaymentModalOpen} />
    </>
  )

  return (
    <>
      {isForm ? (
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} p={10} justifyContent='center' alignItems='center' sx={{ maxWidth: 500 }} display='flex'>
            <Grid container>
              <Grid item xs={12} textAlign='center' pb={2}>
                <Typography variant='h4'>Registration</Typography>
              </Grid>
              <Grid item xs={12}>
                {submtFrom()}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      ) : (
        <Dialog
          open={isOpen}
          onClose={onClose}
          aria-labelledby='user-view-edit'
          aria-describedby='user-view-edit-description'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: modelMaxWidth, bgcolor: 'black' } }}
        >
          <DialogTitle
            id='user-view-edit'
            sx={{
              textAlign: 'center',
              fontSize: '1.3rem !important'
            }}
          >
            {pageTitle}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid
                item
                xs={12}
                p={10}
                justifyContent='center'
                alignItems='center'
                sx={{ maxWidth: 500 }}
                display='flex'
              >
                {submtFrom()}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
