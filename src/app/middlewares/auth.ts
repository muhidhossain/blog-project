import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { _id, role } = decoded;

    const user = await User.isUserExistsById(_id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isBlockedUser = user?.isBlocked;

    if (isBlockedUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
