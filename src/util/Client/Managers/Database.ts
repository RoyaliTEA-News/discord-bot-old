import { Db, MongoClient } from "mongodb";

import { database } from "../../../config";

export default class DatabaseManager {
  client: MongoClient;
  db: Db;

  async connect() {
    this.client = await MongoClient.connect(process.env.MONGO_URI);

    this.client.connect();

    this.db = this.client.db(database);

    return this.db;
  }
}
