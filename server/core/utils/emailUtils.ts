// src/utils/emailUtils.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

export const sendOtpEmail = (email: string, otp: string): void => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log(`Email sent: ${info.response}`);
  });
};

export const sendApprovalEmail = (email: string, apiKey: string, licenseKey: string): void => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Workspace Approved',
    text: `Your workspace has been approved. Here is your API key: ${apiKey} and License key: ${licenseKey}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log(`Approval email sent: ${info.response}`);
  });
};


export const sendawaitingApprovalWorspaceEmail = (email: string): void => {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Workspace Awaiting Approval',
      text: `Your Payment was successful. A follow up email will be sent to you after  this has been approved. `,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error(err);
      else console.log(`Approval email sent: ${info.response}`);
    });
  };
