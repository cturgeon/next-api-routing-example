import { ObjectId } from "mongodb";
import {
  connectToDatabase,
  getDataById,
  addDataByDataArrayId,
} from "../../../../../helpers/db-util";

import { useRouter } from "next/router";

export default async function handler(req, res) {
  const router = useRouter();
  const { dataId, dataArray } = router.query;
  console.log(dataId);
  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({
      message: "could not connect to db for [dataArray]",
      message: error,
    });
  }

  if (req.method === "GET") {
    try {
      let result = await getDataById(client, "data", { _id: ObjectId(dataId) });
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (req.method === "POST") {
    const { id, dataArrayId, finalArrayData } = req.body;
    try {
      const result = await addDataByDataArrayId(
        client,
        "data",
        { _id: ObjectId(id) },
        { _id: ObjectId(dataArrayId) },
        finalArrayData
      );
    } catch (error) {
      res.status(500).json({ message: "could not add data", message: error });
    }
  }

  client.close();
}
