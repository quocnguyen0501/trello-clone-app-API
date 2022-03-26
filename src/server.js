import express from "express";

const app = express();

const hostname = 'localhost';
const port = 8080

app.get('/', (req, res) => {
    res.end('<h1>HELLO WORLD</h1><hr/>');
});

app.listen(port, hostname, () => {
    console.log(`hello server, i'm running at ${hostname}:${port}`);
})
