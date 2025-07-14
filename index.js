import express from 'express';
import config from 'config';
import { connect } from 'mongoose';

import { routes as genres } from './routes/genres.js';
import { router as customer } from './routes/customer.js';
import { routes as movies } from './routes/movies.js';
import { routes as rentals } from './routes/rentals.js';
import { routes as users } from './routes/users.js';
import { routes as auth } from './routes/auth.js';
import logger from './middleware/log.js';

process.on('uncaughtException', (ex) => {
    console.log('WE GOT AN UNCAUGHT EXCEPTION.');
    logger.error(ex.message, ex);
});

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

const app = express();
const port = config.get('initconfig.port');
const defaultConnection = config.get('db');

connect(defaultConnection)
    .then(() => console.log('Connected to MongoDb...'))
    .catch(err => console.log('Error trying to connect to MongoDB...', err));

app.use(express.json());

if (app.get('env') == 'development') {
    console.log('Development...');
}

//Routes
app.use('/api/genres', genres);
app.use('/api/customer', customer);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

//Not found Route
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(500).send('Something failed.');
});
// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});