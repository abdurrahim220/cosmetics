import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../error/appError";
import status from "http-status";
import { UserRole } from "../types/sharedInterface";
import { User } from "../module/user/user.model";

const authMiddleware = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return next(
        new AppError(
          "Unauthorized: You have not permission",
          status.UNAUTHORIZED
        )
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string
      ) as JwtPayload;

      const { userId, iat } = decoded;

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return next(
          new AppError("This user is not found 2!", status.NOT_FOUND)
        );
      }
      const isDeleted = user?.isDeleted;
      if (isDeleted) {
        return next(new AppError("This user is deleted !", status.FORBIDDEN));
      }
      const userStatus = user?.status;

      if (userStatus === "blocked") {
        return next(new AppError("This user is blocked !", status.FORBIDDEN));
      }
      if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
          user.passwordChangedAt,
          iat as number
        )
      ) {
        return next(
          new AppError("You are not authorized !", status.UNAUTHORIZED)
        );
      }
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return next(
          new AppError(
            "Forbidden: You do not have permission to access this resource",
            status.FORBIDDEN
          )
        );
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError("Invalid token", status.UNAUTHORIZED));
      }
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError("Token expired", status.UNAUTHORIZED));
      }
      if (error instanceof jwt.NotBeforeError) {
        return next(new AppError("Token not active", status.UNAUTHORIZED));
      }
    }
  };
};

export default authMiddleware;
