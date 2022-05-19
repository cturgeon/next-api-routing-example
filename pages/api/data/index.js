import {
  connectToDatabase,
  insertData,
  getAllData,
} from "../../../helpers/db-util";

// here we are routing to /api/data to see what data is in our database
export default async function handler(req, res) {
  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "could not connect to DB" });
    return;
  }

  if (req.method === "GET") {
    try {
      const result = await getAllData(client, "data");
      res.status(201).json({ resultData: result, message: "got data from DB" });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "could not get data from DB" });
    }
  }

  if (req.method === "POST") {
    const { input, text } = req.body;

    // some backend validation could go here

    // adding a dataArray that we will PUT stuff later
    const newData = {
      input,
      text,
      dataArray: [],
    };

    let result;
    try {
      result = await insertData(client, "data", newData);
      // when we enter some data into MongoDB it gets an insertedId Object
      result._id = result.insertedId;
      res.status(201).json({ message: "added data", resultData: result });
    } catch (error) {
      client.close();
      res
        .status(500)
        .json({ message: "error while adding data", message: error });
    }
  }
  client.close();
}
