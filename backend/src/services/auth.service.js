import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/generateToken.js';
import ErrorResponse from '../middleware/error.middleware.js';

// Register a new user
export const registerService = async (payload) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new ErrorResponse('User already exists', 400);

  const user = await User.create(payload); // let model hash password
  user.password = undefined;

  const token = generateToken(user._id, user.role);
  return { user, token };
};



// Login user
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ErrorResponse('Invalid credentials', 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ErrorResponse('Invalid credentials', 401);

  user.password = undefined;
  const token = generateToken(user._id, user.role);
  return { user, token };
};

