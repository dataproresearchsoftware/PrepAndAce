import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getAccount, updateAccount, deleteAccount } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/gl/chart-of-account/account/static-data'
import { handleSearch, isAllowed } from 'src/@core/utils'
import { print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModelForm } from 'src/views/pages/gl/chart-of-account/account/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Account'

const defaultValues = {
  level1: null,
  level2: null,
  scode: '',
  acode: '',
  aname: '',
  odr: 0,
  ocr: 0
}

const Account = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.account)

  const [states, setStates] = useState({
    isOpenModal: false,
    isEdit: false,
    pageSize: 5,
    modalForm: 'd',
    isSubmit: false
  })

  const [searchStates, setSearchStates] = useState({ searchText: '', filteredData: [] })
  const [deleteStates, setDeleteStates] = useState({})
  useEffect(() => {
    dispatch(getAccount()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)

        return
      }
      if (searchStates.filteredData.length > 0) {
        setSearchStates({ ...searchStates, filteredData: filteredRows })
      }
    })
  }, [dispatch])

  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('level1', { value: row.l1code, label: row.l1name })
    setValue('level2', { value: row.l2code, label: row.l2name })
    setValue('scode', `00000${row.acode.slice(6)}`.slice(-5))
    setValue('acode', row.acode)
    setValue('aname', row.aname)
    setValue('odr', row.odr)
    setValue('ocr', row.ocr)
    setStates({ ...states, isEdit: true, isOpenModal: true, modalForm: 'c' })
  }

  const handleDiscard = () => {
    reset()
    setStates({ ...states, isOpenModal: false, isEdit: false })
  }

  const handleRefresh = () => {
    reset()
    setStates({
      isOpenModal: false,
      isEdit: false,
      pageSize: 5,
      modalForm: 'c',
      isSubmit: false
    })
    setSearchStates({ searchText: '', filteredData: [] })
  }

  const onSubmit = data => {
    let isOpenModal = states.isOpenModal
    setStates({ ...states, isSubmit: true })
    dispatch(
      updateAccount({
        l1code: data.level1.value,
        l2code: data.level2.value,
        scode: data.scode,
        acode: data.acode,
        aname: data.aname,
        odr: data.odr,
        ocr: data.ocr
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()

      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = ({ data }) => {
    setStates({ ...states, isOpenModal: true, modalForm: 'd' })
    setDeleteStates({
      acode: data.acode,
      aname: data.aname
    })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })

    dispatch(deleteAccount(deleteStates)).then(response => {
      if (response.payload !== false) setStates({ ...states, isSubmit: false, isOpenModal: false })
    })
  }

  const updateColumns =
    isAllowed(permissions, 'U') || isAllowed(permissions, 'D')
      ? [
          ...columns,
          {
            sortable: false,
            filterable: false,
            editable: false,
            disableColumnMenu: false,
            flex: 1,
            minWidth: 100,
            align: 'right',
            headerAlign: 'right',
            headerName: 'Action',
            renderCell: ({ row }) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
                  {isAllowed(permissions, 'U') && (
                    <Tooltip title='Edit' placement='top'>
                      <IconButton size='small' onClick={() => handleEdit(row)}>
                        <Icon icon='tabler:edit' />
                      </IconButton>
                    </Tooltip>
                  )}
                  {isAllowed(permissions, 'D') && (
                    <Tooltip title='Delete' placement='top'>
                      <IconButton size='small' onClick={() => handleConfirm({ data: row })}>
                        <Icon icon='tabler:trash' />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )
            }
          }
        ]
      : columns

  const renderModals = (
    <>
      {states.modalForm === 'd' ? (
        <DeleteModal
          onsubmit={onsubmit}
          onDelete={onDelete}
          onCancel={() => setStates({ ...states, isOpenModal: false })}
          handleDiscard={handleDiscard}
          isSubmit={states.isSubmit}
          isOpenModal={states.isOpenModal}
          title={pageTitle}
        >
          <p style={{ textDecoration: 'underLine', my: 3, textAlign: 'center' }}>
            <strong>
              <span>A Code: {deleteStates.acode}</span>
              <span style={{ paddingLeft: 30 }}>A Name: {deleteStates.aname}</span>
            </strong>
          </p>
        </DeleteModal>
      ) : (
        <ModelForm
          control={control}
          states={states}
          setStates={setStates}
          handleDiscard={handleDiscard}
          errors={errors}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          pageTitle={pageTitle}
          setValue={setValue}
          watch={watch}
          resetField={resetField}
        />
      )}
    </>
  )
  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(item => ({
    'Level1 Code': item.l1code,
    'Level1 Name': item.l1name,
    'Level2 Code': item.l2code,
    'Level2 Name': item.l2name,
    'S Code': item.scode,
    'A Code': item.acode,
    'A Name': item.aname,
    Odr: item.odr,
    Ocr: item.ocr
  }))

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={pageTitle} />
            <DataGrid
              rows={dataList ?? []}
              pageSize={states.pageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
              components={{ Toolbar: DataGridHeaderToolbar }}
              onPageSizeChange={newPageSize => setStates({ ...states, pageSize: newPageSize })}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  onClick: () => setStates({ ...states, isOpenModal: true, modalForm: 'c' }),
                  onChange: event => handleSearch({ value: event.target.value, data: store?.data, setSearchStates }),
                  onPrint: () =>
                    print({
                      title: pageTitle,
                      data: exportDataList
                    }),
                  onRefresh: handleRefresh,
                  clearSearch: () => handleSearch({ value: '', data: store?.data, setSearchStates }),
                  exportTitle: pageTitle,
                  exportData: exportDataList,
                  columns,
                  value: searchStates.searchText,
                  permissions: { C: isAllowed(permissions, 'C'), E: isAllowed(permissions, 'E') }
                }
              }}
              autoHeight
              rowHeight={32}
              getRowId={row => `${row.acode}`}
              columns={updateColumns}
              disableSelectionOnClick
            />
          </Card>
        </Grid>
        {/* -----Modal----- */}
        {renderModals}
      </Grid>
    </>
  )
}

export default Account
