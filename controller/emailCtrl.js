const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@example.com', // Replace with your SMTP username
      pass: 'your-email-password'     // Replace with your SMTP password
    }
  });

  // Set up email data
  let mailOptions = {
    from: '"Sender Name" <your-email@example.com>', // Sender address
    to: to, // List of receivers
    subject: subject, // Subject line
    text: text, // Plain text body
    html: html // HTML body
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
