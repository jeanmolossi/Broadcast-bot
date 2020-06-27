import 'dotenv/config';
import express from 'express';
import path from 'path';

import '@config/typeorm';
import '@shared/container';

import '@modules/bot';

const app = express();

const photosDir = path.resolve(__dirname, '..', '..', '..', 'assets');
app.use('/files', express.static(photosDir));

const { PORT } = process.env;

app.listen(PORT, () => console.log('Listening on port >> 3333'));
