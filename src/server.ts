import 'reflect-metadata'
import express  from 'express';
import "./database";
import { router } from './routes';

const app = express();

//Informamos que vamos utilizar o formato json no body
app.use(express.json());
app.use(router);

app.listen(3333, () => console.log("Server is running! "));

