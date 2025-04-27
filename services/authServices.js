import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import gravatar from "gravatar";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const { APP_DOMAIN } = process.env;

const createVerifyEmail = (email, verificationCode) => ({
  to: email,
  subject: "Verify your email",
  html: `<a target="_blank" href="${APP_DOMAIN}/api/auth/verify/${verificationCode}">Click to verify your email</a>`,
});

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

  const verificationCode = nanoid();

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" }, true);

  const newUser = await User.create({
    ...data,
    password: hashedPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = createVerifyEmail(email, verificationCode);

  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = async (verificationCode) => {
  const user = await findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "Email not found or already verified");
  }

  await user.update({ verify: true, verificationCode: null });
};

export const resendVerifyEmail = async (email) => {
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail(email, user.verificationCode);

  await sendEmail(verifyEmail);
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

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
    user,
  };
};

export const logoutUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user || !user.token) {
    throw HttpError(401, "Not authorized");
  }
  await user.update({ token: null });
};

export const updateAvatar = async (id, avatarURL) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  if (!avatarURL) {
    throw HttpError(400, "Avatar URL is required");
  }
  await user.update({ avatarURL });
};
