var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var user = 'maozhenhua2@foxmail.com',
  pass = 'uwrjrjhpqihtbeae';
var transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: pass
  }
}));

var mails = {
  from: 'max<' + user + '>',
  to: '1036310327@qq.com ',
  subject: 'hello world!',
  text: 'This is from nodejs.'
};

// send mail
transporter.sendMail(mails, function (error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log('Message sent');
  }
  transporter.close(); // 如果没用，关闭连接池
});
