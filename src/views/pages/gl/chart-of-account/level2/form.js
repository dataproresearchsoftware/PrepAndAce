import { Grid, FormControl, TextField, Button, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { getLevel1API } from 'src/configs'
import { useEffect, useState } from 'react'
import { grey } from '@mui/material/colors'

export const ModelForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  const [level1Options, setLevel1Options] = useState([])

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
                      disabled={states.isEdit}
                      sx={{ bgcolor: states.isEdit && grey[100] }}
                      size='small'
                      options={level1Options}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
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
            <FormControl fullWidth>
              <Controller
                name='l2code'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[100] }}
                    variant='outlined'
                    color='secondary'
                    label='CODE'
                    placeholder='CODE auto'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='l2name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    inputProps={{ maxLength: 30 }}
                    label='NAME'
                    onChange={onChange}
                    placeholder='NAME'
                    size='small'
                    error={Boolean(errors.l2name)}
                    helperText={Boolean(errors.l2name) && 'Required'}
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
