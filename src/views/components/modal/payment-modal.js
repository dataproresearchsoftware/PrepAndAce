import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { CardExpiryTextInput, CreditCardTextInput } from '../credit-card/credit-card'
import { PaymentMethodCard } from '../credit-card/PaymentMethodCard'

export const PaymentModal = ({ isOpen, setIsOpen }) => {
  const [states, setStates] = useState({
    isSubmit: false
  })

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      sx={{ '& .MuiPaper-root': { maxWidth: 500 } }}
    >
      <DialogTitle
        id='user-view-edit'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: 3,
          pt: 3
        }}
      >
        Payment Method
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(6)} !important`,
          px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(12)} !important`]
        }}
      >
        {/* onChange={onChange}
              value={value}
              onBlur={onBlur}
              error={Boolean(errors.password)}
               */}

        {/* <Grid container spacing={3}>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <TextField
              variant='outlined'
              fullWidth
              size='small'
              id='email'
              label='Email'
              type='email'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:mail' />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <TextField
              variant='outlined'
              fullWidth
              size='small'
              id='name'
              inputProps={{ style: { textTransform: 'uppercase' } }}
              label='Name on card'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:at' />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <TextField
              variant='outlined'
              fullWidth
              size='small'
              id='cardNumber'
              placeholder='xxxx xxxx xxxx xxxx'
              label='Card Number'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:credit-card' />
                  </InputAdornment>
                ),
                inputComponent: CreditCardTextInput
              }}
            />
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <TextField
              variant='outlined'
              fullWidth
              size='small'
              id='expiry'
              placeholder='MM/YY'
              label='Expiry Date'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:credit-card' />
                  </InputAdornment>
                ),
                inputComponent: CardExpiryTextInput
              }}
            />
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center'>
            <LoadingButton
              loading={states.isSubmit}
              size='small'
              sx={{ mr: 2, width: 90 }}
              variant='contained'
              color='primary'
              onClick={() => alert('Subscribed')}
            >
              Pay
            </LoadingButton>
            <Button
              type='reset'
              size='small'
              sx={{ width: 90 }}
              color='secondary'
              variant='outlined'
              onClick={() => setStates({ ...states, isOpen: false })}
            >
              Cancel
            </Button>
          </Grid>
        </Grid> */}
        <PaymentMethodCard isOpen={isOpen} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal
