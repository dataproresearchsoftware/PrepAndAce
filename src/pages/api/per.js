import { MongoClient } from 'mongodb'

const getMax = async () => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  const result = await db.collection('student_permissions').find().sort({ sn: -1 }).limit(1).toArray()
  let sn = 0
  await client.close()
  sn = result[0]?.sn + 1

  return sn
}

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  let data = Object.keys(req?.body).length > 0 ? req.body : req.query
  switch (req.method) {
    case 'GET':
      result = await db.collection('student_permissions').find(data).toArray()
      res.status(200).json(result)

      break

    case 'POST':
      data.sn = await getMax()
      result = await db.collection('student_permissions').insertOne(data)
      res.status(201).json({ ...result, message: 'Successfully Inserted!' })

      break

    case 'PUT':
      result = await db.collection('student_permissions').updateOne({ sn: data.sn }, { $set: data })
      res.status(200).json(result)
      break

    case 'DELETE':
      result = await db.collection('student_permissions').deleteOne({
        sn: data.sn
      })
      res.status(200).json(result)
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
