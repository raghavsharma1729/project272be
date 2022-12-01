const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: 'test',
    pass: 'test',
  },
  secure: true,
});




module.exports = {
  err: (msg) => ({ err: msg }),
  sendEmail: (to, text) => {
    console.log(to);
    const mailData = {
      from: 'test',  // sender address
      to :[to],   // list of receivers
      subject: 'Your order update',
      text,
    };
    transporter.sendMail(mailData, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });

  }
};
