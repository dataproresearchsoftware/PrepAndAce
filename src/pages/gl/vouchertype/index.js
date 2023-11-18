import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { getVoucherType, updateVoucherType, deleteVoucherType } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/gl/vouchertype/static-data'
import { handleSearch, isAllowed } from 'src/@core/utils'
import { print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { ModelForm } from 'src/views/pages/gl/vouchertype/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Voucher Type'

const defaultValues = {
  vcode: '',
  vname: '',
  vtype: 'P',
  vmode: 'C'
}

const VoucherType = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.voucherType)

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
    dispatch(getVoucherType()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)
      }
    })
  }, [dispatch])

  const handleEdit = row => {
    setValue('vcode', row.vcode)
    setValue('vname', row.vname)
    setValue('vtype', row.vtype)
    setValue('vmode', row.vmode)
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
      updateVoucherType({
        vcode: data.vcode,
        vname: data.vname,
        vtype: data.vtype,
        vmode: data.vmode
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()
      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = ({ data }) => {
    setDeleteStates({ vcode: data.vcode, vname: data.vname })
    setStates({ ...states, modalForm: 'd', isOpenModal: true })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteVoucherType(deleteStates)).then(response => {
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
              <span>Code: {deleteStates.vcode}</span>
              <span style={{ paddingLeft: 30 }}>Name: {deleteStates.vname}</span>
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
        />
      )}
    </>
  )
  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : store?.data

  const exportDataList = dataList?.map(item => ({
    'Voucher Code': item.vcode,
    'Voucher Name': item.vname,
    'Voucher Type': item.vtypename,
    'Voucher Mode': item.vmodename
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
              getRowId={row => row.vcode}
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

export default VoucherType
