import { useState, useEffect } from 'react'
import { Card, CardHeader, Grid, Autocomplete, TextField, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { getAccountBalance } from 'src/store'
import { toast } from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { getAccountAPI } from 'src/configs'
import AccountBalanceTab from 'src/views/pages/gl/reports/accountbalance/account-balance'
import { CustomTab } from 'src/views/components'
import AccountTransactionTab from 'src/views/pages/gl/reports/accountbalance/account-transaction'

const pageTitle = 'Account Balance'
const errorMessage = 'Required!'

const AccountBalance = () => {
  const [states, setStates] = useState({
    pageSize: 10,
    isFind: false,
    isError: false,
    isLoading: false,
    account: { value: '', label: '' },
    data: {}
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [accountOptions, setAccountOptions] = useState([])

  const initialized = async () => {
    //Bind Account List
    const accountResponse = await getAccountAPI()
    if (accountResponse?.error) {
      toast.error(accountResponse.error.message)

      return
    }
    const accountData = accountResponse.data.items
    setAccountOptions(accountData.map(item => ({ value: item.acode, label: `${item.aname} ${item.acode}` })))
  }

  useEffect(() => {
    initialized()
  }, [])

  const handleFind = async () => {
    if (states.account.value.length === 0) {
      setStates({ ...states, isError: true })
    } else {
      setStates({ ...states, data: [], isFind: false, isLoading: true })
      await getAccountBalance({ acode: states.account.value })
        .then(response => {
          if (response?.error) {
            toast.error(response.error.message)

            return
          }

          const data = {
            accountTransaction: response.accountTransaction.items,
            accountBalance: response.accountBalance.items,
            account: states.account
          }

          setStates({ ...states, data, isFind: true, isLoading: false })
        })
        .catch(error => {
          setStates({ ...states, data: {}, isFind: false, isLoading: false })
          toast.error(error.message)
        })
    }
  }

  const handleRefresh = () => {
    setStates({
      pageSize: 10,
      isFind: false,
      isError: false,
      isLoading: false,
      account: null,
      data: []
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Grid container>
              <Grid item xs={12} md={4}>
                <CardHeader title={pageTitle} />
              </Grid>
              <Grid item xs={12} md={8} p={5} display='flex' justifyContent='right'>
                <Autocomplete
                  id='account'
                  size='small'
                  options={accountOptions}
                  value={states.account}
                  getOptionLabel={option => option.label}
                  onChange={(_, data) => {
                    setStates({ ...states, account: data })
                  }}
                  variant='outlined'
                  sx={{ minWidth: '50%', mr: 2 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Account'
                      error={states.isError && states.account.value.length === 0}
                      helperText={states.isError && states.account.value.length === 0 && errorMessage}
                    />
                  )}
                />
                <LoadingButton
                  loading={states.isLoading}
                  sx={{ maxHeight: 40, mr: 1 }}
                  size='medium'
                  variant='contained'
                  onClick={handleFind}
                >
                  <Icon icon='tabler:search' /> Search
                </LoadingButton>
                <Button
                  loading={states.isLoading}
                  sx={{ maxHeight: 40 }}
                  size='medium'
                  variant='outlined'
                  onClick={handleRefresh}
                >
                  <Icon icon='tabler:refresh' /> Refresh
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <CustomTab
            data={[
              {
                value: '1',
                label: 'Account Balance',
                children: states.isFind ? <AccountBalanceTab states={states} setStates={setStates} /> : null
              },
              {
                value: '2',
                label: 'Account Transaction',
                children: states.isFind ? <AccountTransactionTab states={states} setStates={setStates} /> : null
              }
            ]}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AccountBalance
