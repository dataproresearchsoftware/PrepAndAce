import {
  Grid,
  FormControl,
  TextField,
  Switch,
  Button,
  InputLabel,
  FormControlLabel,
  Autocomplete,
  RadioGroup,
  Radio,
  Box,
  Card,
  CardActions,
  Input,
  Divider,
  Typography,
  CircularProgress
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { Modal } from 'src/views/components'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'
import { dateconvert } from 'src/@core/utils'
import { useEffect, useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { getItemTypeAPI } from 'src/configs'

export const ItemForm = ({
  control,
  states,
  handleDiscard,
  onSubmit,
  handleSubmit,
  errors,
  pageTitle,
  setValue,
  watch,
  resetField,
  reset
}) => {
  const [itemTypeOptions, setItemTypeOptions] = useState([])

  const initialized = async () => {
    //Bind Item Type List
    const itemTypeResponse = await getItemTypeAPI()
    if (itemTypeResponse?.error) {
      toast.error(itemTypeResponse.error.message)

      return
    }

    const itemTypeData = itemTypeResponse?.data?.items
    setItemTypeOptions(
      itemTypeData.map(item => ({
        value: item.itype,
        label: item.itname
      }))
    )
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
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12}>
            <FormControl fullWidth size='small'>
              <Controller
                name='itype'
                control={control}
                rules={{
                  required: 'Required'
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      disabled={states.isEdit}
                      sx={{ backgroundColor: states.isEdit && grey[200] }}
                      size='small'
                      options={itemTypeOptions}
                      value={field.value?.value ? field.value : null}
                      getOptionLabel={option => option.label}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='item Type'
                          placeholder='select Item Type'
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

          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <Controller
                name='itemcode'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    disabled
                    sx={{ backgroundColor: grey[200] }}
                    variant='outlined'
                    color='secondary'
                    label='ITEM CODE'
                    placeholder='ITEM CODE AUTO'
                    size='small'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='iname'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='ITEM NAME'
                    onChange={onChange}
                    placeholder='ITEM NAME'
                    size='small'
                    error={Boolean(errors.iname)}
                    helperText={Boolean(errors.iname) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='oqty'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Open-Qty'
                    onChange={onChange}
                    placeholder='Open-Qty'
                    size='small'
                    error={Boolean(errors.oqty)}
                    helperText={Boolean(errors.oqty) && 'Required'}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='orate'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Open-Rate'
                    onChange={onChange}
                    placeholder='Open-Rate'
                    size='small'
                    error={Boolean(errors.orate)}
                    helperText={Boolean(errors.orate) && 'Required'}
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
