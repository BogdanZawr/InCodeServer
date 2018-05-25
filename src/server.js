import router from './routes/user';
import express from 'express';
const serverPort = 8000;
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('',router);

app.listen(serverPort);
