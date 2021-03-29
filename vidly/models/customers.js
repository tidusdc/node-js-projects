const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean
     },
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    phone: { 
        type: Number, 
        minlength: 1,
        maxlength: 255,
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validatecustomer(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(3).required(),
        phone: Joi.number()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validatecustomer;