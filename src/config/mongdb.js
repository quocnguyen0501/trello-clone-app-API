import { MongoClient } from "mongodb";
import { env } from "./environment";

const URI = env.MONGODB_URI;

let options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

export const connectDB = async () => {
    const client = new MongoClient(URI, options);
    try {
        // connect the client to the server
        await client.connect();

        console.log('CONNECT SUCCESSFULLY');

        // list DB
        await listDB(client);
    } finally {
        // ensure that the client will close when finish/error
        await client.close();
    }
}

const listDB = async (client) => {
    const listDB = await client.db().admin().listDatabases();
    console.log('Your list dbs name:');
    listDB.databases.forEach(db => {
        console.log(db.name);
    });
}