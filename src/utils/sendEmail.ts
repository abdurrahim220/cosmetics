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



// This function sends an order confirmation email to the user after they place an order.
// It includes details like the order ID, total price, shipping address, and items ordered.
export const sendOrderConfirmationEmail = async (
  to: string,
  username: string,
  orderId: string,
  totalPrice: number,
  shippingAddress: string,
  items: { products: { title: string }, quantity: number, price: number }[]
) => {
  const itemList = items
    .map(
      (item) => `
        <li>
          ${item.products.title} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}
        </li>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Order Confirmation - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>Thank you for your order! We're processing it now. Here are the details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</li>
        <li><strong>Shipping Address:</strong> ${shippingAddress}</li>
      </ul>
      <h3>Items Ordered:</h3>
      <ul>${itemList}</ul>
      <p>You'll receive another email once your order ships. Happy shopping!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Order Confirmation - ${orderId}`,
    html,
  });
};


// This function sends an order cancellation email to the user after they cancel an order.
// It includes details like the order ID and total price.
export const sendOrderCancellationEmail = async (
  to: string,
  username: string,
  orderId: string,
  totalPrice: number
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Order Cancelled - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>Your order has been successfully cancelled. Here are the details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</li>
      </ul>
      <p>If you have any questions, feel free to contact us. We hope to serve you again soon!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Order Cancellation - ${orderId}`,
    html,
  });
};



// This function sends an order status update email to the user when their order status changes.
// It includes details like the order ID, new status, total price, and shipping address.
export const sendOrderStatusUpdateEmail = async (
  to: string,
  username: string,
  orderId: string,
  newStatus: string,
  totalPrice: number,
  shippingAddress: string
) => {
  const statusMessages = {
    pending: "Your order is still being processed.",
    shipped: "Great news! Your order has been shipped.",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    canceled: "Your order has been canceled, and stock has been restored.",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Order Status Update - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>We wanted to let you know that your order status has been updated:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>New Status:</strong> ${newStatus}</li>
        <li><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</li>
        <li><strong>Shipping Address:</strong> ${shippingAddress}</li>
      </ul>
      <p>${statusMessages[newStatus as keyof typeof statusMessages]}</p>
      <p>If you have any questions, feel free to contact us. Happy shopping!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Order Status Update - ${orderId}`,
    html,
  });
};


// This function sends a role update email to the user when their role changes.
// It includes details like the new role, username, and a link to the user dashboard.
export const sendRoleUpdateEmail = async (
  to: string,
  username: string,
  oldRole: string,
  newRole: string
) => {
  const roleMessages = {
    buyer: "a valued customer",
    seller: "a trusted seller",
    admin: "an administrator",
    "super-admin": "a super administrator",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Role Update Notification - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>We’re writing to inform you that your role with BeautyStore has been updated:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Previous Role:</strong> ${oldRole} (${roleMessages[oldRole as keyof typeof roleMessages]})</li>
        <li><strong>New Role:</strong> ${newRole} (${roleMessages[newRole as keyof typeof roleMessages]})</li>
      </ul>
      <p>This change may affect your permissions and access within our platform. If you have any questions or believe this is an error, please contact our support team.</p>
      <p>Thank you for being part of BeautyStore!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Your Role Has Been Updated - BeautyStore`,
    html,
  });
};


// This function sends a user status update email to the user when their account status changes.
// It includes details like the old status, new status, and a message based on the new status.
export const sendUserStatusUpdateEmail = async (
  to: string,
  username: string,
  oldStatus: string,
  newStatus: string
) => {
  const statusMessages = {
    "in-progress": "Your account is currently being processed or reviewed.",
    blocked: "Your account has been blocked. Please contact support for assistance.",
    active: "Your account is fully active and you can enjoy all features.",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Account Status Update - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>We’re writing to inform you that your account status with BeautyStore has been updated:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Previous Status:</strong> ${oldStatus}</li>
        <li><strong>New Status:</strong> ${newStatus}</li>
      </ul>
      <p>${statusMessages[newStatus as keyof typeof statusMessages]}</p>
      <p>If you have any questions or believe this is an error, please reach out to our support team.</p>
      <p>Thank you for being part of BeautyStore!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Your Account Status Has Been Updated - BeautyStore`,
    html,
  });
};




export const sendProductVerificationEmail = async (
  to: string,
  username: string,
  productTitle: string,
  isVerified: boolean
) => {
  const verificationMessage = isVerified
    ? "Your product has been verified and is now live on BeautyStore!"
    : "Your product has been unverified and is no longer live on BeautyStore. Please review our guidelines or contact support for more details.";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Product Verification Update - BeautyStore</h1>
      <p>Hello ${username},</p>
      <p>We’re writing to inform you about an update to one of your products:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Product:</strong> ${productTitle}</li>
        <li><strong>Verification Status:</strong> ${isVerified ? "Verified" : "Unverified"}</li>
      </ul>
      <p>${verificationMessage}</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Thank you for selling with BeautyStore!</p>
      <p>The BeautyStore Team</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Product Verification Status Updated - ${productTitle}`,
    html,
  });
};