import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.trzrj.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`
  );
  return client;
}

export async function insertData(client, collection, data) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(data);
  return result;
}

export async function getAllData(client, collection) {
  const db = client.db();
  const result = await db
    .collection(collection)
    .find()
    .sort({ _id: -1 })
    .toArray();
  return result;
}

export async function getDataById(client, collection, id) {
  const db = client.db();
  const result = await db.collection(collection).find(id).toArray();
  return result;
}

export async function getAllDataIds(client, collection) {
  const db = client.db();
  const result = await db.collection(collection).distinct("_id", {}, {});
  return result;
}

export async function updateDataArrayById(client, collection, id, data) {
  const db = client.db();
  const result = await db
    .collection(collection)
    .updateOne(id, { $push: { dataArray: data } });
}
