import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { json } from "sequelize";

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

export default {
  register: ctrlWrapper(registerController),
  login: ctrlWrapper(loginController),
};
