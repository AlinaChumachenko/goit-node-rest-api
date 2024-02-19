import express from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
  getCurrent,
  updateAvatar,
} from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.get("/verify/:verificationToken", verifyEmail);
usersRouter.post("/login", login);
usersRouter.get("/current", authenticate, getCurrent);
usersRouter.post("/logout", authenticate, logout);
usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
