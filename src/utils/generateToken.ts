import { Response } from "express";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: Secret,
  expiresIn: number | string = "1h",
  res?: Response
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  const accessToken = jwt.sign(jwtPayload, secret, options);
  const refreshToken = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });
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
