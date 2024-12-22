import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TUser } from '../user/user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './auth.utils';
import { TLoginUser } from './auth.interface';

const registerUser = async (payload: TUser) => {
  if (payload.role && payload.role === 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You don't have permission to create an admin",
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await User.findOne({
    email: payload.email,
  });

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  try {
    const userData: Partial<TUser> = { ...payload };
    userData.password = hashedPassword;

    const newUser = await User.create(userData);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not created');
    }

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isUserBlocked = user?.isBlocked;

  if (isUserBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email as string,
    role: user.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
};
