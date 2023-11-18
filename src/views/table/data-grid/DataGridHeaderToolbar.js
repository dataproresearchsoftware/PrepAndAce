// ** MUI Imports

import { Box, IconButton, Grid, TextField, Button, Menu, MenuItem, Typography } from '@mui/material'
import { GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { useState } from 'react'
import * as XLSX from 'xlsx'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const DataGridHeaderToolbar = ({
  onClick,
  onChange,
  onPrint,
  onRefresh,
  clearSearch,
  exportTitle,
  exportData,
  columns,
  value,
  permissions,
  showRefreshButton = true,
  hideSearchArea = true
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleExport = (title, data, columns) => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${title}.xlsx`)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <form autoComplete='off'>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Box
            sx={{
              gap: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: theme => theme.spacing(2, 5, 4, 5)
            }}
          >
            <Grid container spacing={3}>
              {hideSearchArea && (
                <Grid item md={8} xs={12}>
                  <TextField
                    size='small'
                    padding='none'
                    value={value}
                    onChange={onChange}
                    placeholder='Search…'
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 2, display: 'flex' }}>
                          <Icon icon='tabler:search' fontSize={16} />
                        </Box>
                      ),
                      endAdornment: (
                        <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearSearch}>
                          <Icon icon='tabler:x' fontSize={16} />
                        </IconButton>
                      )
                    }}
                    sx={{
                      mr: 1,
                      width: {
                        xs: 1,
                        sm: 'auto'
                      },
                      '& .MuiInputBase-root > svg': {
                        mr: 2
                      }
                    }}
                  />
                  <GridToolbarFilterButton sx={{ height: 38 }} />
                  {permissions.E && (
                    <>
                      <Button
                        sx={{ ml: 2, gap: 2, height: 38 }}
                        variant='outlined'
                        color='primary'
                        size='medium'
                        onClick={handleClick}
                        startIcon={<Icon icon='tabler:download' />}
                      >
                        Export
                      </Button>

                      <Menu
                        keepMounted
                        id='simple-menu'
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        open={Boolean(anchorEl)}
                      >
                        <MenuItem value='1' onClick={onPrint}>
                          Print /PDF
                        </MenuItem>
                        <MenuItem value='3' onClick={() => handleExport(exportTitle, exportData)}>
                          Excel
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Grid>
              )}

              <Grid item md={4} xs={12} textAlign='right'>
                <>
                  {permissions.C && (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={onClick}
                      sx={{ mr: 2 }}
                      startIcon={<Icon icon='tabler:plus' />}
                    >
                      New
                    </Button>
                  )}
                  {showRefreshButton && (
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={onRefresh}
                      startIcon={<Icon icon='tabler:refresh' />}
                    >
                      Refresh
                    </Button>
                  )}
                </>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default DataGridHeaderToolbar
