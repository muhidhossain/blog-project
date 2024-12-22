import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Blog } from '../blog/blog.model';

const blockUser = async (userId: string) => {
  console.log(userId);
  const user = await User.findById(userId);
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not blocked');
  }

  return null;
};

const deleteBlog = async (blogId: string) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  const result = await Blog.findByIdAndDelete(blogId);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not deleted');
  }

  return null;
};

export const AdminServices = {
  blockUser,
  deleteBlog,
};
