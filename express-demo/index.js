const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');

const authenticate = require('./authenticate');
const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'public' ));
app.use(helmet());

app.use('/api/courses', courses);
app.use('/', home);

console.log( `Application Name ${config.get('name')}`);
console.log( `Mail Server ${config.get( 'mail.host' )}`);
console.log( `Mail Server Password ${config.get('mail.password')}`);

if( app.get('env') === 'development') {
    app.use(morgan('tiny')); // Dev and Staging Only
    debug('Morgan enabled...');
}


app.use(logger);
app.use(authenticate);


const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Listenning on port  ${port} !!!...`));
