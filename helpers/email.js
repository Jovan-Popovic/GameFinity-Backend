const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = () => 
nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "gamefinity03@gmail.com",
        pass:  "gamefinity2003"
    }
});

const mailOptions = (userMail, htmlTem) => {
    let mailOptions = {
    from: process.env.EMAIL,
    to: userMail,
    subject: 'GameFinity - Transaction',
    html: htmlTem
    }
    return mailOptions;
};

module.exports = {
    transporter,
    mailOptions
}