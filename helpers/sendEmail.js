const sgMail = require('@sendgrid/mail')
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(`${SENDGRID_API_KEY}`)

const sendEmail = async (data) =>{
    console.log(data)
    const email = {...data, from: 'natasha169@ukr.net'};
    await sgMail.send(email)
    return true;
}

module.exports = sendEmail;