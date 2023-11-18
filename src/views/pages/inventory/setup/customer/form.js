import { Grid, FormControl, TextField, Switch, Button, InputLabel, FormControlLabel } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'
import { dateconvert } from 'src/@core/utils'

export const CustomerForm = ({ control, states, handleDiscard, onSubmit, handleSubmit, errors, pageTitle }) => {
  return (
    <Modal
      onsubmit={onsubmit}
      onClose={handleDiscard}
      isOpen={states.isOpenModal}
      title={`${states.isEdit ? 'Edit' : 'Add New'} ${pageTitle}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <Controller
                name='Customercode'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[200] }}
                    variant='outlined'
                    color='secondary'
                    label='Customer Code'
                    placeholder='Customer Code AUTO'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='customername'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Customer Name'
                    onChange={onChange}
                    placeholder='Customer Name'
                    size='small'
                    error={Boolean(errors.customername)}
                    helperText={Boolean(errors.customername) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='addr'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Address'
                    onChange={onChange}
                    placeholder='Address'
                    size='small'
                    error={Boolean(errors.addr)}
                    helperText={Boolean(errors.addr) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='contact_no'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Contact No'
                    onChange={onChange}
                    placeholder='Contact No'
                    size='small'
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
                name='glcode'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    disabled
                    label='glcode'
                    onChange={onChange}
                    placeholder='GLCode AUTO'
                    size='small'
                    error={Boolean(errors.glcode)}

                    //helperText={Boolean(errors.glcode) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} display='flex' justifyContent='left'>
            <InputLabel style={{ marginTop: 9, marginRight: 5 }}>Active</InputLabel>
            <FormControl>
              <Controller
                name='status'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Switch defaultChecked checked={value} />}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Controller
                name='status_dt'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={dateconvert(value)}
                    disabled
                    sx={{ backgroundColor: grey[200] }}
                    variant='outlined'
                    color='secondary'
                    label='STATUS DATE'
                    placeholder='STATUS DATE auto'
                    size='small'
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
