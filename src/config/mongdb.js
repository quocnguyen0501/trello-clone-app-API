import { MongoClient } from "mongodb";
import { env } from "./environment";

let dbInstance = null;

const URI = env.MONGODB_URI;

let options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

export const  connectDB = async () => {
    const client = new MongoClient(URI, options);

    // connect the client to the server
    await client.connect();
    // assign clientDB to dbInstance
    dbInstance = client.db(env.DATABASE_NAME);
}

// Get DB instace
export const getDatabase = () => {
    if (!dbInstance) {
        throw new Error('Must connect to Database first!');
    }
    return dbInstance;
}