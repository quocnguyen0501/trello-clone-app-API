import express from "express";
import { env } from "./config/environment";
import { connectDB } from "./config/mongdb";
import { BoardsModel } from "./models/boards.model";

connectDB()
    .then(() => console.log('Connected success to database server!'))
    .then(() => bootServer())
    .catch(error => {
        console.error(error);
        // dung lai cho den khi app code duoc sua xong
        process.exit(1);
    })

const bootServer = () => {
    const app = express();

    const hostname = env.HOST;
    const port = env.PORT;

    app.get('/', async (req, res) => {
        res.end('<h1>HELLO WORLD QUOC NGUYEN</h1><hr/>');
    });

    app.listen(port, hostname, () => {
        console.log(`hello server, i'm running at ${hostname}:${port}`);
    })
}
