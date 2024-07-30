require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const AfricasTalking = require('africastalking');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const africasTalking = AfricasTalking({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME
});

const sms = africasTalking.SMS;

app.post('/sendmail', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions)
        .then(info => {
            console.log(`Email sent: ${info.response}`);

            // Send SMS using Africa's Talking
            const smsMessage = `New contact form submission: Name: ${name}, Email: ${email}, Message: ${message}`;
            return sms.send({
                to: ['+27660722042'], // Your phone number with country code
                message: smsMessage
            });
        })
        .then(response => {
            console.log(`SMS sent: ${response}`);
            res.json({ success: true });
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            res.status(500).json({ success: false, error: 'Error sending email or SMS' });
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
