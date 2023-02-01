import { body } from "express-validator";

export const signIn = [
  body("email", "невальдный email").isEmail(),
  body("password", "пароль должен быть минимум 5 и максимум 20 символов").isLength({ min: 5, max: 20 }),
];

export const signUp = [
  body("email", "невальдный email").isEmail(),
  body("password", "пароль должен быть минимум 5 и максимум 20 символов").isLength({ min: 5, max: 20 }),
  body("fullName", "имя должно быть минимум 3 и максимум 20 символов").isLength({ min: 3, max: 20 }),
  body("avatarUrl", "ссылка не валидна").optional().isURL(),
];
