import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Box, IconButton, Grid, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DataGridHeaderToolbar from 'src/views/table/data-grid/DataGridHeaderToolbar'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'

//import { getSupplier, updateSupplier, deleteSupplier } from 'src/store/inventory/supplier'
import { getSupplier, updateSupplier, deleteSupplier } from 'src/store'
import { toast } from 'react-hot-toast'
import { columns } from 'src/views/pages/inventory/setup/supplier/static-data'
import { dateconvert, handleSearch, isAllowed } from 'src/@core/utils'
import { print } from 'src/@core/utils'
import usePermission from 'src/@core/hooks/usePermission'
import { SupplierForm } from 'src/views/pages/inventory/setup/supplier/form'
import DeleteModal from 'src/views/components/modal/delete-modal'

const pageTitle = 'Suppliers'

const defaultValues = {
  suppliercode: null,
  suppliername: '',
  addr: '',
  contact_no: '',
  glcode: '',
  status: true,
  status_dt: ''
}

const Supplier = () => {
  const dispatch = useDispatch()
  const permissions = usePermission()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const store = useSelector(state => state.supplier)

  const storeData = store?.data?.map(row => ({
    ...row,
    status_dt: row.status_dt?.length > 0 && dateconvert(row.status_dt)
  }))

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
    dispatch(getSupplier()).then(response => {
      if (response?.error) {
        toast.error(response.error.message)
      }
    })
  }, [dispatch])
  useEffect(() => {
    handleSearch({ value: searchStates.searchText, data: store?.data, setSearchStates })
  }, [states.isSubmit])

  const handleEdit = row => {
    setValue('suppliercode', row.suppliercode)
    setValue('suppliername', row.suppliername)
    setValue('addr', row.addr)
    setValue('contact_no', row.contact_no)
    setValue('glcode', row.glcode)
    setValue('status', row.status === 'Active')
    setValue('status_dt', row.status_dt)
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
      updateSupplier({
        suppliercode: data.suppliercode,
        suppliername: data.suppliername,
        addr: data.addr,
        contact_no: data.contact_no,
        glcode: data.glcode,
        status: data.status ? 'Active' : 'Inactive'
      })
    ).then(response => {
      if (response.payload !== false) isOpenModal = false
      reset()

      setStates({ ...states, isSubmit: false, isOpenModal: isOpenModal })
    })
  }

  const handleConfirm = ({ data }) => {
    setDeleteStates({ suppliercode: data.suppliercode, suppliername: data.suppliername })
    setStates({ ...states, modalForm: 'd', isOpenModal: true })
  }

  const onDelete = () => {
    setStates({ ...states, isSubmit: true })
    dispatch(deleteSupplier({ suppliercode: deleteStates.suppliercode })).then(response => {
      if (response.payload !== false) handleRefresh()
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
              <span>supplier: {deleteStates.suppliercode}</span>
              <span style={{ paddingLeft: 30 }}>Name: {deleteStates.suppliername}</span>
            </strong>
          </p>
        </DeleteModal>
      ) : (
        <SupplierForm
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
  const dataList = searchStates.filteredData?.length ? searchStates.filteredData : storeData

  const exportDataList = dataList?.map(item => {
    const data = {
      suppliercode: item.suppliercode,
      suppliername: item.suppliername,
      addr: item.addr,
      contact_no: item.contact_no,
      glcode: item.glcode,
      status: item.status ? 'Active' : 'Inactive',
      status_dt: item.status_dt
    }

    return data
  })

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
                  onChange: event => handleSearch({ value: event.target.value, data: storeData, setSearchStates }),
                  onPrint: () =>
                    print({
                      title: pageTitle,
                      data: exportDataList
                    }),
                  onRefresh: handleRefresh,
                  clearSearch: () => handleSearch({ value: '', data: storeData, setSearchStates }),
                  exportTitle: pageTitle,
                  exportData: exportDataList,
                  columns,
                  value: searchStates.searchText,
                  permissions: { C: isAllowed(permissions, 'C'), E: isAllowed(permissions, 'E') }
                }
              }}
              autoHeight
              rowHeight={32}
              getRowId={row => row.suppliercode}
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

export default Supplier
