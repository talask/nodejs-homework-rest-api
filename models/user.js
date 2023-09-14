const { version } = require('joi');
const { Schema, model } = require('mongoose')
const { handleMongooseError } = require('../helpers')
const Joi = require('joi');

const emailRegExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/);

const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegExp,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Set password for user'], 
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: "",
    },
    
}, { versionKey: false, timestamps: true })

userSchema.post('save', handleMongooseError)
const User = model("User", userSchema)


const signInSchema = Joi.object({
    
    email: Joi.string()
        .pattern(emailRegExp)
        .required(),
  
    password: Joi.string().required(),
    
  });

  const loginSchema = Joi.object({
     
    email: Joi.string()
        .pattern(emailRegExp)
        .required(),
  
    password: Joi.string().required(),
    
  });

  

  
  module.exports = {
    signInSchema,
    loginSchema,
    User,
  }