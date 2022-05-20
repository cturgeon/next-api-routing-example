import { ObjectId } from "mongodb";
import {
  connectToDatabase,
  getDataById,
  addDataByDataArrayId,
} from "../../../../../helpers/db-util";

export default async function handler(req, res) {
  const { dataId, dataArrayId } = req.query;
  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({
      message: "could not connect to db for [dataArray]",
      message: error,
    });
  }

  const findData = {
    dataArray: { $elemMatch: { _id: ObjectId(dataArrayId) } },
  };

  if (req.method === "GET") {
    try {
      let result = await getDataById(client, "data", findData);
      let data = result[0].dataArray.find(
        (data) => data._id.toString() === dataArrayId
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  if (req.method === "POST") {
    const { finalArrayData } = req.body;
    try {
      const result = await addDataByDataArrayId(
        client,
        "data",
        { _id: ObjectId(dataId) },
        { _id: ObjectId(dataArrayId) },
        finalArrayData
      );
    } catch (error) {
      res.status(500).json({ message: "could not add data", message: error });
    }
  }

  client.close();
}
