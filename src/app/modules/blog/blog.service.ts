import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate('author'), query)
    .search(['title', 'content'])
    .sortBy()
    .filter();

  const result = await blogQuery.modelQuery;

  return result.map((blog) => ({
    _id: blog._id,
    title: blog.title,
    content: blog.content,
    author: blog.author,
  }));
};

const createBlogIntoDB = async (payload: TBlog, userId: Types.ObjectId) => {
  try {
    const blogData: Partial<TBlog> = { ...payload };

    blogData.author = userId;

    const newBlog = await (await Blog.create(blogData)).populate('author');

    if (!newBlog) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Blog not created');
    }

    return {
      _id: newBlog._id,
      title: newBlog.title,
      content: newBlog.content,
      author: newBlog.author,
    };
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const updateBlogIntoDB = async (
  blogId: string,
  payload: Partial<TBlog>,
  userId: Types.ObjectId,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'user') {
    const blog = await Blog.findOne({ _id: blogId, author: userId });

    if (!blog) {
      throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
    }
  } else {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
    }
  }

  const result = await Blog.findByIdAndUpdate(blogId, payload, {
    new: true,
  }).populate('author');

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not updated');
  }

  return {
    _id: result?._id,
    title: result?.title,
    content: result?.content,
    author: result?.author,
  };
};

const deleteBlogFromDB = async (blogId: string, userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'user') {
    const blog = await Blog.findOne({ _id: blogId, author: userId });

    if (!blog) {
      throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
    }
  } else {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
    }
  }

  const result = await Blog.findByIdAndDelete(blogId);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not deleted');
  }

  return null;
};

export const BlogService = {
  getAllBlogsFromDB,
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};
