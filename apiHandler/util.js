const nodemailer = require('nodemailer');
const appPass = process.env.APP_PASS;
const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: '96raghavsharma+marketplace@gmail.com',
    pass: appPass,
  },
  secure: true,
});




module.exports = {
  err: (msg) => ({ err: msg }),
  sendEmail: (to, text) => {
    console.log(to);
    const mail = 'raghav.sharma01@sjsu.edu';
    const mailData = {
      from: '96raghavsharma+marketplace@gmail.com',  // sender address
      to: [mail],   // list of receivers
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
