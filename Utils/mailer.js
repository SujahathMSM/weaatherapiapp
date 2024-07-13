const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
        throw new Error('EMAIL and EMAIL_PASSWORD environment variables are required');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.EMAIL_PASSWORD // Your email password
        }
    });
};

const sendEmail = async (to, subject, htmlContent) => {
    if (!to || !subject || !htmlContent) {
        throw new Error('To, subject, and HTML content are required to send an email');
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: htmlContent,
        headers: {
            'Content-Type': 'text/html'
        }
    };

    const transporter = createTransporter();

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to: ' + mailOptions.to);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Error sending email. Please try again later.');
    }
};

module.exports = sendEmail;

