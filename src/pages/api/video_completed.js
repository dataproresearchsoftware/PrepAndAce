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

        let next_video_data = await db
          .collection('course_detail')
          .find({ courseId: data?.courseId, active: 'true', sno: { $gt: data?.sno } })
          .sort({ sno: 1 })
          .limit(1)
          .toArray()

        video_data = { ...video_data, seenPoint: data.seenPoint, isPlay: false, status: 2 }

        next_video_data = next_video_data[0]
        next_video_data = { ...next_video_data, isPlay: true, status: 1 }

        await db
          .collection('course_detail')
          .updateOne({ courseId: data?.courseId, sno: data?.sno }, { $set: video_data })

        await db
          .collection('course_detail')
          .updateOne({ courseId: data?.courseId, sno: next_video_data?.sno }, { $set: next_video_data })

        res.status(201).json(next_video_data)
      }
      break

    default:
      res.status(405).json({ error: 'Unsupported HTTP method' })
  }

  await client.close()
}
