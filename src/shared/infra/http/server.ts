import 'dotenv/config';
import express from 'express';
import path from 'path';

import '@config/typeorm';
import '../../container';

import '@modules/bot';

const app = express();

const photosDir = path.resolve(__dirname, '..', '..', '..', 'assets');
app.use('/files', express.static(photosDir));

app.listen(3333, () => console.log('Listening on port >> 3333'));
