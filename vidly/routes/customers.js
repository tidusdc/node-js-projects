const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer,validate} = require('../models/customers');

async function createCustomer( isGold = false, name, phone) {
    let customer = new Customer({
        isGold: isGold,
        name: name,
        phone: phone
    });
    try {
        customer = await customer.save();
        console.log(result);
    } catch(err) {
        for(field in err.errors)
            console.log(err.errors[field].message);
    }
    return customer;
}

async function updateCustomer( id, isGold = false, name, phone ) {
    const query = { _id: id };
    const customer = await Customer.findOneAndUpdate( query ,{
        $set: {
            isGold: isGold,
            name: name,
            phone: phone,
        },
       
    }, { old: true,  useFindAndModify: true } );
    return customer;
}

async function getCustomers() {
    const customers = await Customer
    .find()
    .sort({ name: 1 })
  return customers;
}

async function getCustomer(id) {
    const customer = await Customer
      .find({ _id: id  })
      .sort({ name: 1 })
      .select({ name: 1 });
    return customer;
 }


async function removeCustomer( id ) {
    const result = await Customer.deleteMany( { _id: id} ) 
    return result;
}


router.get( '/', async (req, res) => {
    const updateResult = await getCustomers();
    if ( !updateResult ) return res.status(404).send('No customers were found');
    console.dir(`GET all Customers ${updateResult}`);
    res.send( updateResult );
});

router.post('/', async (req, res) => {
    const { error } = validate( req.body );
    // Validate
    // If Invalid, return 400 - Bad Request
    if( error ) return res.status(400).send(error.details[0].message);
    const updateResult = await createCustomer( req.body.isGold, req.body.name, req.body.phone );
    console.dir(`POST Request : Customer Added ${updateResult}`);

    res.send( updateResult );
});


// api/customers/1
router.get( '/:id', async (req, res) => {
    const updateResult = await getCustomer(req.params.id);
    if ( !updateResult ) return res.status(404).send('The customer with the given ID was not found');
    console.dir(`GET Customer by ID ${updateResult}`);
    res.send( updateResult );
});


router.put( '/:id', async (req, res) => {
    const { error } = validate( req.body );
    if( error ) return res.status(400).send(error.details[0].message);
    // Update customer
    const updateResult = await updateCustomer( req.params.id, req.body.isGold, req.body.name, req.body.phone );
    if ( !updateResult ) return res.status(404).send('The customer with the given ID was not found');


    console.dir(`PUT Request : Customer Updated ${updateResult}`);
    res.send( updateResult );
});

router.delete( '/:id', async (req, res) => {
    const deleteResult = await removeCustomer( req.params.id );
    if ( !deleteResult ) return res.status(404).send('The customer with the given ID was not found');
    res.send(deleteResult);

});

module.exports = router;