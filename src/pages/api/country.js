import { MongoClient } from 'mongodb'

const ObjectId = require('mongodb').ObjectId

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  const data = Object.keys(req?.body).length > 0 ? req.body : req.query

  switch (req.method) {
    case 'GET':
      result = await db.collection('country').find(data).toArray()
      res.status(200).json(result)
      break

    case 'POST':
      result = await db.collection('country').insertOne(data)

      res.status(201).json(result)
      break

    case 'PUT':
      result = await db.collection('country').updateOne({ _id: data._id }, { $set: data })
      res.status(200).json(result)
      break

    case 'DELETE':
      result = await db.collection('country').deleteOne({
        _id: data._id
      })
      res.status(200).json(result)
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
