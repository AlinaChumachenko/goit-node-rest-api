import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import { promises as fs } from "fs";
import Jimp from "jimp";

import { User } from "../modals/users.js";
import HttpError from "../helpers/HttpError.js";
import { registerSchema } from "../schemas/usersSchemas.js";

dotenv.config();
const { SECRET_KEY } = process.env;

const avatarDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "72h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "No Content" });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!req.file) throw HttpError(400, "missing field avatar");

    const { path: tmpUpload, originalname } = req.file;
    await Jimp.read(tmpUpload).then((img) =>
      img.resize(250, 250).write(`${tmpUpload}`)
    );

    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarDir, fileName);

    await fs.rename(tmpUpload, resultUpload);

    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
