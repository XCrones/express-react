import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/User.model.js";
import { saveUserDB, searchUserByEmailDB, getUserByIdDB } from "../PSQL/Users.db.js";

export const signUp = async (req, res) => {
  try {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      return res.status(400).json(erros.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    });

    const result = await saveUserDB(newUser);

    if (result === false) {
      return res.status(400).json({
        message: "email адрес занят",
        email: req.body.email,
      });
    }

    const { passwordhash, ...userData } = result;

    const token = jwt.sign(
      {
        id: result.id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    return res.json({
      ...userData,
      token,
    });
  } catch (e) {
    return res.status(500).json("Не удалось зарегистрироваться");
  }
};

export const signIn = async (req, res) => {
  try {
    const result = await searchUserByEmailDB(req.body.email);

    if (!result) {
      return res.status(400).json("Неверный логин или пароль");
    }

    const isValidPass = await bcrypt.compare(req.body.password, result.passwordhash);

    if (!isValidPass) {
      return res.status(400).json("Неверный логин или пароль");
    }

    const token = jwt.sign(
      {
        id: result.id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    const { passwordhash, ...userData } = result;

    return res.json({
      ...userData,
      token,
    });
  } catch (e) {
    return res.status(500).json("Не удалось авторизоваться");
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await getUserByIdDB(req.userId);

    if (!result) {
      return res.status(404).json({
        message: "пользователь не найден",
      });
    }

    const { passwordhash, ...userData } = result;

    return res.json({
      ...userData,
    });
  } catch (err) {
    return res.status(500).json("Не доступа");
  }
};
