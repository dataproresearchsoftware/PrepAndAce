import { MongoClient } from 'mongodb'

/* Function to generate combination of password */
const generatePass = () => {
  let pass = ''

  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$'

  for (let i = 1; i <= 10; i++) {
    let char = Math.floor(Math.random() * str.length + 1)

    pass += str.charAt(char)
  }

  return pass
}

const getMaxUserId = async () => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  const result = await db.collection('users').find().sort({ user_id: -1 }).limit(1).toArray()
  let user_id = 0
  await client.close()
  user_id = result[0]?.user_id + 1

  return user_id
}

const getMax = async () => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  const result = await db.collection('registration').find().sort({ student_id: -1 }).limit(1).toArray()
  let student_id = 0
  await client.close()
  student_id = result[0]?.student_id + 1

  return student_id
}

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  let data = Object.keys(req?.body).length > 0 ? req.body : req.query
  switch (req.method) {
    case 'GET':
      if (data.student_id !== '-1') {
        result = await db.collection('registration').find(data).toArray()
        res.status(200).json(result)
      } else {
        res.status(400).json({ error: 'Bad Request!' })
      }
      break

    case 'POST':
      {
        const isExists = await db.collection('registration').findOne({ email_address: data.email_address })
        if (isExists) {
          res.status(200).json({ error: 'Email already exists!' })
        } else {
          data.student_id = await getMax()
          result = await db.collection('registration').insertOne(data)
          const password = generatePass()

          const userData = {
            student_id: data.student_id,
            user_id: await getMaxUserId(),
            user_name: data.email_address,
            password,
            active: 'true',
            user_type: 'S'
          }

          await db.collection('users').insertOne(userData)

          res.status(201).json({ ...result, message: 'Successfully Registered!' })
        }
      }
      break

    case 'PUT':
      result = await db.collection('registration').updateOne({ studentid: data.studentid }, { $set: data })
      res.status(200).json(result)
      break

    case 'DELETE':
      result = await db.collection('registration').deleteOne({
        studentid: data.studentid
      })
      res.status(200).json(result)
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
