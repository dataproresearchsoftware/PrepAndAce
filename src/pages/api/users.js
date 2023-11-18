import { MongoClient } from 'mongodb'

const getMax = async () => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  const result = await db.collection('users').find().sort({ user_id: -1 }).limit(1).toArray()
  let user_id = 0
  await client.close()
  user_id = result[0]?.user_id + 1

  return user_id
}

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  let data = Object.keys(req?.body).length > 0 ? req.body : req.query
  console.log('data', data.user_id === '-1')
  switch (req.method) {
    case 'GET':
      if (data.user_id !== '-1') {
        result = await db.collection('users').find(data).toArray()
        res.status(200).json(result)
      } else {
        res.status(400).json({ error: 'Bad Request!' })
      }
      break

    case 'POST':
      data.user_id = await getMax()
      result = await db.collection('users').insertOne(data)
      res.status(201).json({ ...result, message: 'Successfully Registered!' })

      break

    case 'PUT':
      result = await db.collection('users').updateOne({ studentid: data.studentid }, { $set: data })
      res.status(200).json(result)
      break

    case 'DELETE':
      result = await db.collection('users').deleteOne({
        studentid: data.studentid
      })
      res.status(200).json(result)
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
