//weatherapiapp/Utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: htmlContent,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to: '+mailOptions.to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
