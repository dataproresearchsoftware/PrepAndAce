export const print = ({ title, data, header = [], footer = [] }) => {
  const columns = Object.keys(data[0])

  const nw = window.open('_blank')

  const headerColumns = () => {
    let element = ''
    for (let i = 0; i < header.length; i++) {
      element += `<td colspan='${header[i].colspan || '1'}' style='${header[i].align || 'left'}'><strong>${
        header[i].field
      }</strong></td>`
    }

    return element
  }

  const footerColumns = () => {
    let element = ''
    for (let i = 0; i < footer.length; i++) {
      element += `<th colspan='${footer[i].colspan || '1'}' style='${footer[i].align || 'left'}'><strong>${
        footer[i].field
      }</strong></th>`
    }

    return element
  }

  const tableColumns = () => {
    let element = ''
    for (let i = 0; i < columns.length; i++) {
      element += `<th>${columns[i]}</th>`
    }

    return element
  }

  const body = () => {
    let element = ''

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      element += `<tr>`
      for (let x = 0; x < columns.length; x++) {
        const col = row[columns[x]]
        element += `<td>${col}</td>`
      }
      element += `</tr>`
    }

    return element
  }

  const html = `<html><head><title>Print</title>
  <link href="${window.location.origin}/mui/mui.min.css" rel="stylesheet" />
  </head><body><h2 style='text-align:center'>${title}</h2>
  <table class='mui-table mui-table--bordered' style='width:100%'>
  ${
    header.length > 0
      ? `<thead><tr>
            ${headerColumns()}
          </tr></thead>`
      : ''
  }
  <thead>
    <tr>
      ${tableColumns()}
    </tr>
  </thead>
  <tbody>
    ${body()}
  </tbody>
  ${
    footer.length > 0
      ? `<tbody><tr>
            ${footerColumns()}
          </tr></tbody>`
      : ''
  }
</table>
  </body></html>`
  nw.document.write(html)

  setTimeout(() => {
    nw.print()
    nw.close()
  }, 1000)
}
