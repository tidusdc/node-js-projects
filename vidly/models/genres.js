const mongoose = require('mongoose');
const Joi = require('joi');

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

function validategenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validategenre;