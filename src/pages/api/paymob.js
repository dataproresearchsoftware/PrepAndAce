// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

const PaymentTypes = ['CC', 'EP']

const validatePaymentType = type => {
  const findType = PaymentTypes.find(i => i === type)

  return findType !== undefined
}

export default async function postPayment(req, res) {
  if (req.method === 'POST') {
    const {
      amount = 0,
      payment_type = null,
      email = '',
      first_name = '',
      last_name = '',
      phone_number = ''
    } = req?.body

    const v_payment_type = validatePaymentType(payment_type)

    const resp = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/getpaymentid`)
    const v_payment_id = resp?.data?.payment_id

    //string PAYMENT_ID, YYMMDD000000000
    //float AMOUNT,
    //string PAYMENT_TYPE
    if (
      (amount !== 0 && v_payment_type !== false && email.length > 0,
      first_name.length > 0,
      last_name.length > 0,
      phone_number.length > 0)
    ) {
      const paymentKey = process.env.NEXT_PUBLIC_PaymentKey
      const ULoginURL = process.env.NEXT_PUBLIC_ULoginURL
      const paymentOrder = process.env.NEXT_PUBLIC_paymentOrder
      const paymentCard = process.env.NEXT_PUBLIC_paymentCard
      const iFrameURL = process.env.NEXT_PUBLIC_iFrameURL
      const CC_ClientId = process.env.NEXT_PUBLIC_CC_ClientId
      const currency = process.env.NEXT_PUBLIC_currency
      const expiration = process.env.NEXT_PUBLIC_expiration
      const iframeId = process.env.NEXT_PUBLIC_iframeId

      let prodShtDesc = 'Fee Payment'
      let OrderId = null

      //Get payment for payment
      let token = ''
      try {
        const genToken = await axios.post(ULoginURL, { api_key: paymentKey })
        token = genToken.data.token
      } catch (error) {
        return res.status(400).json({ message: 'Bad Request!' })
      }

      //-----------------------------------------------------------------------------//

      let paymentAmount = (amount * 100).toString()
      if (payment_type == 'CC') {
        //let amountPayment = amount /// 0.974
        //amountPayment = Math.round(amountPayment * 100)
        //paymentAmount = amountPayment.toString()
        prodShtDesc = 'Pay Fee through Credit Card'
      }

      const paymentOrderBody = {
        auth_token: token,
        delivery_needed: false,
        amount_cents: paymentAmount,
        currency,
        merchant_order_id: v_payment_id,
        items: [
          {
            name: prodShtDesc,
            amount_cents: paymentAmount,
            description: '',
            quantity: 1
          }
        ]
      }
      try {
        const respPaymentOrder = await axios.post(paymentOrder, paymentOrderBody)
        OrderId = respPaymentOrder.data.id
      } catch (error) {
        return res.status(400).json({ message: 'Bad Request!' })
      }
      if (payment_type == 'CC') {
        try {
          const creditCardJson = {
            auth_token: token,
            amount_cents: paymentAmount,
            expiration,
            order_id: OrderId,
            billing_data: {
              apartment: '1',
              email,
              floor: '1',
              first_name,
              street: '1',
              building: '1',
              phone_number,
              shipping_method: 'PKG',
              extra_description: v_payment_id,
              postal_code: '00000',
              city: 'Karachi',
              country: 'Pakistan',
              last_name,
              state: 'Sindh'
            },
            currency,
            integration_id: CC_ClientId,
            lock_order_when_paid: false
          }

          const respCardPayment = await axios.post(paymentCard, creditCardJson)
          const orderToken = respCardPayment.data.token
          const CardPaymentURL = `${iFrameURL}${orderToken}`

          return res.status(200).json({ order_id: OrderId, merchant_order_id: v_payment_id, CardPaymentURL })
        } catch (error) {
          return res.status(400).json({ message: 'Due To Bad Network Please Try Again Later!' })
        }
      }
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return res.status(400).json({ message: 'Bad Request!' })
}
