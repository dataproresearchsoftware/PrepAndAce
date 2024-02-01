export default async function getpaymentid(req, res) {
  const date = new Date()
  const YY = date.getFullYear().toString().substr(-2)
  const MM = `0${date.getMonth() + 1}`.substr(-2)
  const DD = `0${date.getDay()}`.substr(-2)
  const HH = `0${date.getHours()}`.substr(-2).toString()
  const MI = `0${date.getMinutes()}`.substr(-2).toString()
  const SS = `0${date.getSeconds()}`.substr(-2).toString()
  const MS = `00${date.getMilliseconds()}`.substr(-3).toString()
  const ID = `${HH}${MI}${SS}${MS}`.substr(-9).toString()
  const payment_id = `${YY}${MM}${DD}${ID}`
  res.status(200).json({ payment_id })
}
