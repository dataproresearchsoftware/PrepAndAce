import { Grid, FormControl, TextField, Button, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { getLevel1API, getLevel2API } from 'src/configs'
import { useEffect, useState } from 'react'
import { grey } from '@mui/material/colors'

export const ModelForm = ({
  control,
  states,
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  pageTitle,
  setValue,
  watch,
  resetField
}) => {
  const [level1Options, setLevel1Options] = useState([])
  const [level2Options, setLevel2Options] = useState([])

  const initialized = async () => {
    //Bind Level 1 List
    const response = await getLevel1API()
    if (response?.error) {
      toast.error(response.error.message)

      return
    }
    const level1Data = response.data.items
    setLevel1Options(level1Data.map(item => ({ value: item.l1code, label: item.l1name })))
  }

  useEffect(() => {
    initialized()
  }, [])

  const handleLevel1ToChange = async data => {
    //Bind Level 2 List
    const response = await getLevel2API({ l1code: data.value })
    if (response?.error) {
      toast.error(response.error.message)
      resetField('level2')

      return
    }
    const level2Data = response.data.items
    setLevel2Options(level2Data.map(item => ({ value: item.l2code, label: item.l2name })))
  }

  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth size='small'>
              <Controller
                name='level1'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      disabled={states.isEdit}
                      sx={{ bgcolor: states.isEdit && grey[100] }}
                      options={level1Options}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => {
                        field.onChange(data)
                        handleLevel1ToChange(data)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='LEVEL 1'
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
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth size='small'>
              <Controller
                name='level2'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      disabled={states.isEdit}
                      sx={{ bgcolor: states.isEdit && grey[100] }}
                      options={level2Options}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='LEVEL 2'
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='scode'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    label='S CODE'
                    placeholder='S CODE auto'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <Controller
                name='acode'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    label='A CODE'
                    placeholder='A CODE auto'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='aname'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    inputProps={{ maxLength: 40 }}
                    label='A NAME'
                    onChange={onChange}
                    placeholder='A NAME'
                    size='small'
                    error={Boolean(errors.aname)}
                    helperText={Boolean(errors.aname) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='odr'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='ODR'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    inputProps={{ min: 0, maxLength: 10 }}
                    onChange={onChange}
                    placeholder='ODR'
                    size='small'
                    error={Boolean(errors.odr)}
                    helperText={Boolean(errors.odr) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='ocr'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='OCR'
                    type='number'
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 15)
                    }}
                    inputProps={{ min: 0 }}
                    onChange={onChange}
                    placeholder='OCR'
                    size='small'
                    error={Boolean(errors.ocr)}
                    helperText={Boolean(errors.ocr) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <LoadingButton loading={states.isSubmit} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              {states.isEdit ? 'Update' : 'Save'}
            </LoadingButton>
            <Button type='reset' size='large' color='secondary' variant='outlined' onClick={handleDiscard}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
