const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then( () => console.log('Connected to MongoDB...'))
    .catch( err => console.error('Could not connect to MongoDB', err));

const genreSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
     },
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
    }
     
});
    
const Genre = mongoose.model('Genre', genreSchema);

async function createGenre( id, name) {
    const genre = new Genre({
        id:id,
        name: name
    });
    try {
        const result = await genre.save();
        console.log(result);
    } catch(err) {
        for(field in err.errors)
            console.log(err.errors[field].message);
    }
    return genre;
}
//createGenre();



const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
    { id: 4, name: 'Drama '}
];


async function updateGenre( id, name ) {
    // Query first
    // find by id
    // modify
    // save
    const query = { id: id };
    const genre = await Genre.findOneAndUpdate( query ,{
        $set: {
            name: name,
        },
       
    }, { old: true,  useFindAndModify: true } );

    return genre;
}

async function getGenres() {
    const genres = await Genre
    .find()
 //   .skip((pageNumbeer - 1) * pageSize )
  //  .find({ price: { $gte: 10, $lte: 20 } })
  // .find({ price: { $in: [10, 15, 20 ] }})
 //  .or([ {author: 'Mosh'}, {isPublished:true} ])
//    .and( [ ] )
// starts with Mosh
  //  .find({ author: /^Mosh/ })
    // ends with Hamedani
//    .find({ author: /Hamedani$/i })
    // Contains Mosh
 //  .find({ author: })
 //   .limit( pageSize )
    .sort({ name: 1 })
  return genres;
}




async function getGenre(id) {
    // eq (equal
    // ne (not equal)
    // gt (greater than)
    // gte ( greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)
     // /api/courses?pageNumber=2&pageSize=10
     
    const genre = await Genre
      .find({ id: id  })
   //   .skip((pageNumbeer - 1) * pageSize )
    //  .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10, 15, 20 ] }})
   //  .or([ {author: 'Mosh'}, {isPublished:true} ])
  //    .and( [ ] )
  // starts with Mosh
    //  .find({ author: /^Mosh/ })
      // ends with Hamedani
  //    .find({ author: /Hamedani$/i })
      // Contains Mosh
   //  .find({ author: })
   //   .limit( pageSize )
      .sort({ name: 1 })
      .select({ name: 1 });
  
    return genre;
 }


async function removeGenre( id ) {
    // Query first
    // find by id
    // modify
    // save
   // const result = await Course.deleteMany( { _id: id} ) 
    const result = await Genre.deleteMany( { id: id} ) 
    return result;
 


}


router.get( '/', async (req, res) => {
    const updateResult = await getGenres();
    if ( !updateResult ) return res.status(404).send('No genres were found');
    console.dir(`GET all Genres ${updateResult}`);
    res.send( updateResult );
});

router.post('/', async (req, res) => {
    const { error } = validategenre( req.body );
    // Validate
    // If Invalid, return 400 - Bad Request

    if( error ) return res.status(400).send(error.details[0].message);
   
 
    const updateResult = await createGenre( req.body.id, req.body.name );
    console.dir(`POST Request : Genre Added ${updateResult}`);

    res.send( updateResult );
});


// api/genres/1
router.get( '/:id', async (req, res) => {
    const updateResult = await getGenre(req.params.id);
    if ( !updateResult ) return res.status(404).send('The genre with the given ID was not found');
    console.dir(`GET Genre by ID ${updateResult}`);
    res.send( updateResult );
});


router.put( '/:id', async (req, res) => {
    // Look up the genre 
    // If no existing, return 404
    //const genre = genres.find( c => c.id === parseInt(req.params.id) );
    const { error } = validategenre( req.body );
    // Validate
    // If Invalid, return 400 - Bad Request
    if( error ) return res.status(400).send(error.details[0].message);
    // Update genre
    const updateResult = await updateGenre( req.params.id, req.body.name );
    if ( !updateResult ) return res.status(404).send('The genre with the given ID was not found');
    // Return the updated genre

    console.dir(`PUT Request : Genre Updated ${updateResult}`);
    res.send( updateResult );
});

router.delete( '/:id', async (req, res) => {
    // Look up the genre
    // If no existing, return 404
  

    // Delete
    const deleteResult = await removeGenre( req.params.id );
    if ( !deleteResult ) return res.status(404).send('The genre with the given ID was not found');

    // Return the same genre
    res.send(deleteResult);

});

function validategenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
}

module.exports = router;