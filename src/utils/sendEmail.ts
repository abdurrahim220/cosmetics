/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { EmailOptions } from "../interface/sharedInterface";
import AppError from "../error/appError";
import status from "http-status";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "z.abdurrahim6@gmail.com",
    pass: "dfew hdcj adcp oigk",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(
      "gmail services is not ready to send the email please check the email configuration"
    );
  } else {
    console.log("gmail services is ready to send the email");
  }
});


export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"BeautyStore" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new AppError("Failed to send email", status.BAD_REQUEST);
  }
};

export const sendVerificationOtpToEmail = async (to: string, otp: number) => {
  const html = `
    <h1>Welcome to BeautyStore</h1>
    <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
    <h2>${otp}</h2>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>If you didn't request this, please ignore this email.</p>
    `;
  await sendEmail({ to, subject: "Verify your email address", html });
};
