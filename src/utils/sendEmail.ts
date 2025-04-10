/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { EmailOptions } from "../types/sharedInterface";
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

export const sendForgotPasswordOtpVerificationToEmail = async (
  to: string,
  otp: number
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">Welcome to BeautyStore</h1>
        <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
        <h2 style="color: #d9534f;">${otp}</h2>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you for choosing BeautyStore.</p>
        <p>This password is valid for 5min only!</p>
      </div>
    `;
  await sendEmail({
    to,
    subject: "Reset your password -OTP verification",
    html,
  });
};




export const sendWelcomeLoginEmail = async (
  to: string,
  username: string,
  device: string,
  loginTime: Date,
  location: string
) => {
  // Format the login time to a readable string
  const formattedTime = loginTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Welcome Back to BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>We noticed a new login to your BeautyStore account. Here are the details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Time:</strong> ${formattedTime}</li>
        <li><strong>Device:</strong> ${device}</li>
        <li><strong>Location:</strong> ${location}</li>
      </ul>
      <p>If this was you, you can safely ignore this email. If you didn't log in, please secure your account immediately by resetting your password.</p>
      <p>Happy shopping!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;
  
  await sendEmail({
    to,
    subject: "New Login to Your BeautyStore Account",
    html,
  });
};