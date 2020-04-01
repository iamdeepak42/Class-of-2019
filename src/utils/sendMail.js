const nodemailer = require('nodemailer');

module.exports = sendMail = async (options) => {
    try {
        let transporter = nodemailer.createTransport({
            service: process.env.SERVICE_PROVIDER,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        }

        const info = await transporter.sendMail(message);
    } catch (err) {
        console.log(err);
    }
}