import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

export const createToken = (
  jwtPayload: { _id: Types.ObjectId; email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};
