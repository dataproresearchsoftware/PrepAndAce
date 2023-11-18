import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Card, Tab } from '@mui/material'
import { useState } from 'react'

export const CustomTab = props => {
  const { data } = props
  const [value, setValue] = useState('1')

  return (
    <Card>
      <TabContext value={value}>
        <TabList onChange={(_, data) => setValue(data)} aria-label='simple tabs example'>
          {data.map(item => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </TabList>
        {data.map(item => (
          <TabPanel key={item.value} value={item.value}>
            {item.children}
          </TabPanel>
        ))}
      </TabContext>
    </Card>
  )
}
