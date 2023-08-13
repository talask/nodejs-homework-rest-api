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

  module.exports = {
    schema,
  }