import { Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { config } from "../config";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: Secret,
  res?: Response
) => {
  const accessToken = jwt.sign(jwtPayload, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign(jwtPayload, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  if (res) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
