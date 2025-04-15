import * as authService from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

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
  const { token } = await authService.loginUser(req.body);
  res.json({
    token,
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

export default {
  register: ctrlWrapper(registerController),
  login: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
};
