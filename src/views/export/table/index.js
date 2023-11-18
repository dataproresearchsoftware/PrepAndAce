export const ExportTable = ({ data, columns }) => {
  return (
    <>
      <div id='printablediv'>
        <table className='mui-table mui-table--bordered'>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.flex}>{column.headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.l1code}>
                {columns.map((column, index) => (
                  <td key={index}>{item[column.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
