import { ObjectId } from "mongodb";
import {
  connectToDatabase,
  getDataById,
  addDataByDataArrayId,
} from "../../../../../helpers/db-util";

export default async function handler(req, res) {
  const { dataId } = req.query;
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
      res.status(200).json(result);
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
