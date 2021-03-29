const Joi = require('joi');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then( () => console.log('Connected to MongoDB...'))
    .catch( err => console.error('Could not connect to MongoDB', err));


app.use(express.json());
app.use('/api/genres' , genres);
app.use('/api/customers' , customers);

const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Listenning on port  ${port} !!!...`)); 

