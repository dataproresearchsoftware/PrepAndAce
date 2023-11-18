import { MongoClient } from 'mongodb'

const ObjectId = require('mongodb').ObjectId

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  let data = Object.keys(req?.body).length > 0 ? req.body : req.query
  if (data?.courseId) {
    data = { ...data, courseId: parseInt(data.courseId) }
  }
  switch (req.method) {
    case 'GET':
      result = await db.collection('course_detail').find(data).toArray()
      res.status(200).json(result)
      break

    case 'POST':
      result = await db.collection('course_detail').insertOne(data)

      res.status(201).json(result)
      break

    case 'PUT':
      result = await db.collection('course_detail').updateOne({ courseid: data.courseid }, { $set: data })
      res.status(200).json(result)
      break

    case 'DELETE':
      result = await db.collection('course_detail').deleteOne({
        courseid: data.courseid
      })
      res.status(200).json(result)
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
