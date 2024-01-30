import DataURIParser from "datauri/parser.js";
import JWT from "jsonwebtoken";
// import sgMail from '@sendgrid/mail';
import path from "path";

// Set up SendGrid API key
// sgMail.setApiKey('your-sendgrid-api-key');

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

// // Send reset password email using nodemailer and SendGrid
// export const sendResetEmail = async (userEmail, resetToken) => {
//     const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;
  
//     const msg = {
//       to: userEmail,
//       from: 'your-email@example.com', // Replace with your email
//       subject: 'Password Reset',
//       html: `Click <a href="${resetLink}">here</a> to reset your password.`,
//     };
  
//     try {
//       await sgMail.send(msg);
//       console.log('Email sent');
//     } catch (error) {   
//       console.error(error);
//     }
//   };