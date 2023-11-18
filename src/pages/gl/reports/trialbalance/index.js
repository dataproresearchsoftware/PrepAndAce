import { useState, useEffect } from 'react'
import { Card, CardHeader, Grid, Autocomplete, TextField, FormControl, Button, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { getAccountBalance } from 'src/store'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import usePermission from 'src/@core/hooks/usePermission'
import { LoadingButton } from '@mui/lab'
import { getTrialBalanceAPI } from 'src/configs'
import { CustomTab } from 'src/views/components'
import TrialBalanceTab from 'src/views/pages/gl/reports/trialbalance/trial-balance'
import PLBSTab from 'src/views/pages/gl/reports/trialbalance/pl-bs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { dateconvert } from 'src/@core/utils'
import Spinner from 'src/@core/components/spinner'

const defaultValues = {
  startdate: null,
  enddate: null
}

const pageTitle = 'Trial Balance'
const errorMessage = 'Required!'

const TrialBalance = () => {
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    resetField,
    formState: { errors }
  } = useForm({ defaultValues })

  const [states, setStates] = useState({ pageSize: 10, isLoading: false, isFind: false, data: [] })

  const handleRefresh = () => {
    reset()
    setStates({ pageSize: 10, isLoading: false, data: [] })
  }

  const onSubmit = async data => {
    setStates({ ...states, isLoading: true, isFind: false })

    const params = {
      startdate: dateconvert(data.startdate),
      enddate: dateconvert(data.enddate)
    }

    await getTrialBalanceAPI(params)
      .then(response => {
        setStates({
          ...states,
          isLoading: false,
          isFind: true,
          data: response?.data?.items
        })
      })
      .catch(() => {
        setStates({ ...states, isLoading: false, isFind: false })
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ bgcolor: 'white' }} display='flex' justifyContent='center' boxShadow={5}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <CardHeader title={pageTitle} />
                </Grid>
                <Grid item xs={12} md={3} display='flex' justifyContent='center' alignItems='center'>
                  <FormControl fullWidth>
                    <Controller
                      name='startdate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <DatePickerWrapper>
                            <ReactDatePicker
                              selected={value}
                              isClearable
                              showMonthDropdown
                              showYearDropdown
                              dateFormat='dd-MMM-yyyy'
                              maxDate={watch('enddate')}
                              popperPlacement='auto'
                              onChange={onChange}
                              placeholderText='SELECT DATE'
                              customInput={
                                <TextField
                                  fullWidth
                                  label='START DATE'
                                  placeholder='SELECT DATE '
                                  size='small'
                                  error={Boolean(errors.startdate)}
                                  helperText={Boolean(errors.startdate) && 'Required'}
                                />
                              }
                            />
                          </DatePickerWrapper>
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} display='flex' justifyContent='center' alignItems='center'>
                  <FormControl fullWidth>
                    <Controller
                      name='enddate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <DatePickerWrapper>
                            <ReactDatePicker
                              selected={value}
                              isClearable
                              showMonthDropdown
                              showYearDropdown
                              dateFormat='dd-MMM-yyyy'
                              minDate={watch('startdate')}
                              popperPlacement='auto'
                              onChange={onChange}
                              placeholderText='SELECT DATE'
                              customInput={
                                <TextField
                                  fullWidth
                                  label='END DATE'
                                  placeholder='SELECT DATE '
                                  size='small'
                                  error={Boolean(errors.enddate)}
                                  helperText={Boolean(errors.enddate) && 'Required'}
                                />
                              }
                            />
                          </DatePickerWrapper>
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} display='flex' justifyContent='right' alignItems='center'>
                  <LoadingButton
                    loading={states.isLoading}
                    size='medium'
                    type='submit'
                    sx={{ mr: 1 }}
                    variant='contained'
                  >
                    <Icon icon='tabler:search' /> Search
                  </LoadingButton>
                  <Button
                    loading={states.isLoading}
                    size='medium'
                    onClick={handleRefresh}
                    sx={{ mr: 5 }}
                    variant='outlined'
                  >
                    <Icon icon='tabler:refresh' /> Refresh
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {states.isLoading && (
          <Grid container>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Spinner sx={{ maxHeight: 200 }} />
            </Grid>
          </Grid>
        )}
        {states.isFind && (
          <Grid item xs={12}>
            <CustomTab
              data={[
                {
                  value: '1',
                  label: 'Trial Balance',
                  children: states.isFind ? <TrialBalanceTab stateData={states.data} /> : null
                },
                {
                  value: '2',
                  label: 'PL Summary',
                  children: states.isFind ? (
                    <PLBSTab classification='P' stateData={states.data} pageTitle='PL Summary' />
                  ) : null
                },
                {
                  value: '3',
                  label: 'Balance Sheet',
                  children: states.isFind ? (
                    <PLBSTab classification='B' stateData={states.data} pageTitle='Balance Sheet' />
                  ) : null
                }
              ]}
            />
          </Grid>
        )}
      </Grid>
    </form>
  )
}

export default TrialBalance
