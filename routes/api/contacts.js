const express = require('express')

const router = express.Router()

const contactsModule = require('../../models/contacts');

const { HttpError } = require('../../helpers')

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/))
    .required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(new RegExp(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/))
    .required()
});

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsModule.listContacts();
    res.json(contacts)
  } catch (error) {
    next(error) 
  }

})

router.get('/:contactId', async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const contact = await contactsModule.getContactById(contactId);

    if (!contact) {
       throw HttpError(404, 'Not found')
      
       } 

    res.json( contact )

  } catch (error) {
    next(error)    
  }

})

router.post('/', async (req, res, next) => {
  try {
   
    const { error } = schema.validate(req.body);

    if (error) {
      console.log(error.details)
      const fieldName = error.details[0].context.key;
      throw HttpError(400, `missing required ${fieldName}, ${error.message}`);
    } 
   

    const contact = await contactsModule.addContact(req.body);
    if(!contact) {
      throw HttpError(400, "The contact is in the contact list");
    }

    res.status(201).json(contact)

  } catch (error) {
    next(error)
  }

})

router.delete('/:contactId', async (req, res, next) => {
  try{

    const { contactId } = req.params;
    const contact = await contactsModule.removeContact(contactId)

    if (!contact) {
      throw HttpError(404, 'Not found')
    } 

    res.json({message: "contact deleted"} )

  } catch (error) {
     next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {

    if (!req.body) throw HttpError(400, "missing fields");

    const { error } = schema.validate(req.body);

    if (error) {
      
      const fieldName = error.details[0].context.key;
      throw HttpError(400, `missing required ${fieldName}, ${error.message}`);
    }
    
    

    const { contactId } = req.params;
    const contact = await contactsModule.updateContact(contactId, req.body);

    if (!contact) {
      throw HttpError(404, 'Not found')
    } 

    res.json(contact)

  } catch (error) {
    next(error)
  }

})

module.exports = router
