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
import { typeOptions, modeOptions } from './static-data'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'

export const ModelForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
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
            <FormControl fullWidth>
              <Controller
                name='vcode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='CODE'
                    onChange={onChange}
                    placeholder='CODE'
                    size='small'
                    textTransform='uppercase'
                    error={Boolean(errors.vcode)}
                    helperText={Boolean(errors.vcode) && 'Required'}
                    inputProps={{ maxLength: 3 }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='vname'
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
                    error={Boolean(errors.vname)}
                    helperText={Boolean(errors.vname) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel id='user-view-status-label'>Type</InputLabel>
            <FormControl fullWidth size='small' variant='filled'>
              <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                {typeOptions.map(item => (
                  <Controller
                    key={item.value}
                    name='vtype'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        value={item.value}
                        onChange={onChange}
                        control={<Radio checked={item.value === value} />}
                        label={item.label}
                      />
                    )}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputLabel id='user-view-status-label'>Mode</InputLabel>
            <FormControl fullWidth size='small' variant='filled'>
              <RadioGroup row aria-label='colored' name='colored' defaultValue='primary'>
                {modeOptions.map(item => (
                  <Controller
                    key={item.value}
                    name='vmode'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        value={item.value}
                        onChange={onChange}
                        control={<Radio checked={item.value === value} />}
                        label={item.label}
                      />
                    )}
                  />
                ))}
              </RadioGroup>
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
