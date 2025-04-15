import bcrypt from "bcrypt";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (data) => {
  const { email, password } = data;
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({ ...data, password: hashedPassword });
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    email,
  };

  const token = generateToken(payload);

  await user.update({ token });

  return {
    token,
  };
};

export const logoutUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user || !user.token) {
    throw HttpError(401, "Not authorized");
  }
  await user.update({ token: null });
};
