import DataURIParser from "datauri/parser.js";
import JWT from "jsonwebtoken";
import mandrillTransport from "nodemailer-mandrill-transport";
import nodemailer from "nodemailer";
import path from "path";

// Set up Mandrill API key
const mandrillOptions = {
    auth: {
        apiKey: process.env.MANDRILL_API_KEY,
    },
};

// Set up SendGrid API key
// sgMail.setApiKey('your-sendgrid-api-key');

const transporter = nodemailer.createTransport(mandrillTransport(mandrillOptions));

const getDataUri = (file) => {
    const parser = new DataURIParser();
    // const extName = file.originalname.split(".").pop();
    const extName = path.extname(file.originalname).toString(); // (.png, .jpg, .jpeg, .gif, .bmp, .webp, .svg, .tiff, .ico, .jfif, .pjpeg, .pjp, .avif, .apng, .x-icon, .)
    return parser.format(extName, file.buffer);
}

export default getDataUri;

// Generate JWT token
export const generateResetToken = (userId) => {
    return JWT.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Send reset password email using nodemailer and SendGrid
export const sendResetEmail = async (userEmail, resetToken) => {
    const resetLink = `http://127.0.0.1:8080/forgot-password?token=${resetToken}`;
    
    // mandrill options
    const mailOptions = {
        from: 'your-email@example.com', // Replace with your email
        to: userEmail,
        subject: 'Password Reset',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    try {
        // await sgMail.send(mailOptions);
        const sentEmail = await transporter.sendMail(mailOptions);
        console.log('Email sent', sentEmail);
    } catch (error) {   
        console.error('Email not sent:',error);
    }
  };

  export const baseUrl = () => {
    let url;
    process.env.NODE_ENV = "development" ? url = process.env.LOCAL_DOMAIN : url = process.env.PRODUCTION_DOMAIN;
    return url;
  }