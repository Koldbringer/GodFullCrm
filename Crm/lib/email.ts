import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export function sendEmail({ to, subject, body }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@example.com',
      pass: 'your-password',
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    text: body,
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}