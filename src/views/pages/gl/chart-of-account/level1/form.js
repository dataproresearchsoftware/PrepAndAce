import {
  Grid,
  FormControl,
  TextField,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Autocomplete
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { classificationOptions, typeOptions } from './static-data'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'

export const ModelForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  return (
    <Modal
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='l1code'
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
                name='l1name'
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
                    error={Boolean(errors.l1name)}
                    helperText={Boolean(errors.l1name) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel id='user-view-status-label'>Classification</InputLabel>
            <FormControl fullWidth size='small' variant='filled'>
              <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                {classificationOptions.map(item => (
                  <Controller
                    key={item.id}
                    name='classification'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        value={item.value}
                        onChange={onChange}
                        control={<Radio checked={item.value === value} />}
                        label={item.title}
                      />
                    )}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth size='small'>
              <Controller
                name='type'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      size='small'
                      options={typeOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='TYPE'
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
