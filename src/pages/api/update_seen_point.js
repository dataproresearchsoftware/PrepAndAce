import { MongoClient } from 'mongodb'

const ObjectId = require('mongodb').ObjectId

export default async function handler(req, res) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI)

  await client.connect()
  const db = client.db()
  let result = []
  let data = req.body
  switch (req.method) {
    case 'POST':
      {
        let video_data = await db
          .collection('course_detail')
          .find({ courseId: data?.courseId, sno: data?.sno })
          .toArray()

        video_data = { ...video_data, seenPoint: data.seenPoint }

        const _res = await db
          .collection('course_detail')
          .updateOne({ courseId: data?.courseId, sno: data?.sno }, { $set: video_data })

        res.status(201).json(_res)
      }
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
