import express, { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { api } from '@app/api/api';

dotenv.config();

const PORT = process.env['PORT'];

if(!PORT) {
    throw Error('PORT is not defined as an environment variable');
}

const app = express();

const start = async () => {
    await mongoose.connect('mongodb://localhost');
    
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api', api(Router()))
    app.use('/react', express.static('react-build'));

    app.listen(PORT, () => {
        console.log(`Express server is listening on port ${PORT}`);
    })
}

start().catch(e => console.error(e));
