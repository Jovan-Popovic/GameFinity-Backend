const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { transporter, mailOptions } = require('../helpers/email')


async function emaiTransac(userMail, buyer, seller){
    let transporterr = transporter()

    let htmlTem = await readFile('../helpers/transaction.html', 'utf8');
    htmlTem = htmlTem.replace("##Buyer", buyer);
    htmlTem = htmlTem.replace("##Seller", seller);

    let mailOptionss = mailOptions(userMail, htmlTem)

    transporterr.sendMail(mailOptionss, function(err, inf){
        if(err){
            console.log(err);
        }
    })
}

module.exports = {
    emaiTransac,
}