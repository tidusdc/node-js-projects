const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
    { id: 4, name: 'Drama '}
];

router.get( '/', (req, res) => {
    res.send( genres );
});

router.post('/', (req, res) => {
    const { error } = validategenre( req.body );
    // Validate
    // If Invalid, return 400 - Bad Request

    if( error ) return res.status(400).send(error.details[0].message);
   
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send( genre );
});


// api/genres/1
router.get( '/:id', (req, res) => {
    const genre = genres.find( c => c.id === parseInt(req.params.id) );
    if ( !genre ) return res.status(404).send('The genre with the given ID was not found');
    res.send( genre );
});


router.put( '/:id', (req, res) => {
    // Look up the genre 
    // If no existing, return 404
    const genre = genres.find( c => c.id === parseInt(req.params.id) );
    if ( !genre ) return res.status(404).send('The genre with the given ID was not found');
    const { error } = validategenre( req.body );
    // Validate
    // If Invalid, return 400 - Bad Request
    if( error ) return res.status(400).send(error.details[0].message);
    // Update genre
    genre.name = req.body.name;
    // Return the updated genre


    res.send( genre );
});

router.delete( '/:id', (req, res) => {
    // Look up the genre
    // If no existing, return 404
    const genre = genres.find( c => c.id === parseInt(req.params.id) );
    if ( !genre ) return res.status(404).send('The genre with the given ID was not found');

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the same genre
    res.send(genre);

});

function validategenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = router;