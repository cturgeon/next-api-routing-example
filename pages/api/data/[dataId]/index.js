import { ObjectId } from "mongodb";
import {
  connectToDatabase,
  getDataById,
  updateDataArrayById,
} from "../../../../helpers/db-util";

export default async function handler(req, res) {
  const { dataId } = req.query;
  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "could not connect to DB" });
    return;
  }

  if (req.method === "GET") {
    try {
      let result = await getDataById(client, "data", { _id: ObjectId(dataId) });
      res.status(200).json(result);
    } catch (error) {
      client.close();
      console.error(error);
      return;
    }
  }

  if (req.method === "PUT") {
    const { input, text } = req.body;
    // adding a nested array to our data to eventually PUT more data
    const newData = {
      input,
      text,
      finalArray: [],
    };

    try {
      const result = updateDataArrayById(
        client,
        "data",
        { _id: ObjectId(dataId) },
        JSON.stringify(newData)
      );
      res.status(201).json({ message: "updated data", data: result });
    } catch (error) {
      res.status(500).json({ message: "failed to update data" });
    }
  }
}
