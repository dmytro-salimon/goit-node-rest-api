import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import { authRegisterSchema, authLoginSchema } from "../schemas/authSchemas.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authRegisterSchema),
  authControllers.register
);

authRouter.post("/login", validateBody(authLoginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatarController
);

export default authRouter;
