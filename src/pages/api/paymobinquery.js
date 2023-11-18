// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

export default async function postPayment(req, res) {
  try {
    if (req.method === 'POST') {
      const { merchant_order_id = '', order_id = '' } = req?.body

      if (merchant_order_id.length > 0 && order_id.length > 0) {
        const ULoginURL = process.env.NEXT_PUBLIC_ULoginURL
        const paymentKey = process.env.NEXT_PUBLIC_PaymentKey
        const paymentInquiry = process.env.NEXT_PUBLIC_paymentInquiry

        //Get Token for Payment Inquiry
        let token = ''

        try {
          const genToken = await axios.post(ULoginURL, { api_key: paymentKey })
          token = genToken.data.token
        } catch (error) {
          return res.status(400).json({ message: 'Bad Request!' })
        }

        //-----------------------------------------------------------------------------//

        const paymentInquiryBody = {
          auth_token: token,
          merchant_order_id,
          order_id
        }
        try {
          const respPaymentOrder = await axios.post(paymentInquiry, paymentInquiryBody)

          return res.status(200).json(respPaymentOrder.data)
        } catch (error) {
          return res.status(400).json({ message: 'Due To Bad Network Please Try Again Later!' })
        }
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'Bad Request!' })
  }
}
