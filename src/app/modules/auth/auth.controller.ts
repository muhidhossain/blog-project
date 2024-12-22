import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
import { TUser } from '../user/user.interface';
import config from '../../config';
import { Request, Response } from 'express';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role, isBlocked }: TUser = req.body;

  const result = await AuthServices.registerUser({
    name,
    email,
    password,
    role,
    isBlocked,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production' ? true : false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      token: accessToken,
    },
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
};
