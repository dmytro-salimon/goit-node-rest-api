import fs from "node:fs/promises";
import path from "node:path";
import * as authService from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const avatarsDir = path.resolve("public", "avatars");

const registerController = async (req, res) => {
  const newUser = await authService.registerUser(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginController = async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrentController = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const logoutController = async (req, res) => {
  const { id } = req.user;
  await authService.logoutUser(id);
  res.json({
    message: "Logout success",
  });
};

const updateAvatarController = async (req, res) => {
  const { id } = req.user;
  const { path: tempPath, filename } = req.file;
  const newPath = path.join(avatarsDir, filename);
  await fs.rename(tempPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await authService.updateAvatar(id, avatarURL);
  res.status(200).json({
    avatarURL,
  });
};

export default {
  register: ctrlWrapper(registerController),
  login: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
};
