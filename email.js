const nodemailer = require('nodemailer');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'harshithakasarapu0504@gmail.com',
        pass: 'enwp zogp tbxt xzqn',
    },
});

const app = express();
app.use(cors());

// Define a route to handle both GET and POST requests for sending email
app.all('/send-email', (req, res) => {
    if (req.method === 'POST') {
        // Create a message object
        const mailOptions = {
            from: 'harshithakasarapu0504@gmail.com',
            to: 'kharshitha93@gmail.com',
            subject: `Daily Report - ${new Date().toLocaleDateString()}`,
            text: 'Hello Admin,\n\nThis is the daily report of ' + new Date().toLocaleDateString() + '\n\nBest Wishes, \nThank you!\n',
            attachments: [
                {
                    filename: 'output_results.xlsx',
                    content: fs.createReadStream('output_results.xlsx'),
                },
            ],
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Failed to send Email' });
            } else {
                console.log('Email sent:', info.response);
                res.json({ message: 'Email sent successfully' });
            }
        });
    } else {
        // Handling GET request (if needed)
        res.send('Express server is running!');
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));