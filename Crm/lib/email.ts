import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export function sendEmail({ to, subject, body }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'serwer2440139.home.pl',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'grzegorz@koldbringers.pl',
      pass: 'blaeritipol',
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'grzegorz@koldbringers.pl',
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