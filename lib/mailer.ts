// mailer.ts
import * as nodemailer from 'nodemailer';


// Create a transporter object
const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: 'gmail', // or other services like 'Outlook', 'Yahoo', etc.
  auth: {
    user: `${process.env.USER_EMAIL}`, // your email
    pass: `${process.env.USER_EMAIL_APP_PASSWORD}`, // your email password or an app password
  },
});

// Function to send an email
export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
