const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { transporter, mailOptions } = require('../helpers/email')
const User = require('./user')


async function sendEmail(userMail, buyer, seller, userId, type, name){
    let transporterr = transporter()
    let htmlTem

    if(type == "activate") {
        htmlTem = await readFile('./helpers/activate.html', 'utf8');
        htmlTem = htmlTem.replace("##Username", buyer);
        htmlTem = htmlTem.replace("##id", userId);
    }
    else {
        htmlTem = await readFile('./helpers/transaction.html', 'utf8');
        htmlTem = htmlTem.replace("##Buyer", buyer);
        htmlTem = htmlTem.replace("##Seller", seller);
    }

    let mailOptionss = mailOptions(userMail, htmlTem, name)

    transporterr.sendMail(mailOptionss, function(err, inf){
        if(err){
            console.log(err);
        }
    })
}

module.exports = {
    sendEmail
}