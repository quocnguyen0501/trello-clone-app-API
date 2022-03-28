import express from "express";
import { env } from "./config/environment";
import { connectDB } from "./config/mongdb";

const app = express();

const hostname = env.HOST;
const port = env.PORT;

try {
    connectDB();
} catch (error) {
    console.log(error);
}

app.get('/', (req, res) => {
    res.end('<h1>HELLO WORLD QUOC NGUYEN</h1><hr/>');
});

app.listen(port, hostname, () => {
    console.log(`hello server, i'm running at ${hostname}:${port}`);
})
