import express from "express";
import cors from 'cors'
import { env } from "./config/environment";
import { connectDB } from "./config/mongdb";
import { apiV1 } from "./routes/v1";
import { corsOptions } from "./config/CORS";

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

    app.use(cors(corsOptions));

    const hostname = env.HOST;
    const port = env.PORT;

    // enable request body data
    app.use(express.json())

    // hàm ko khai báo đường dẫn cụ thể, do đó nó sẽ được thực hiện mỗi lần request (get,post,delete,...)
    // use APIs v1
    app.use('/v1', apiV1);

    app.listen(port, hostname, () => {
        console.log(`hello server, i'm running at ${hostname}:${port}`);
    })
}
