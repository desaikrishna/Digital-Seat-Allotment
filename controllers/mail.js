var path = require('path');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    secure: false, 
    auth: {
        user: 'mc.sagar2@gmail.com', 
        pass: '' //use your account
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter

