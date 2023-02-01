import { body } from "express-validator";

export const Cart = [
  body("id", "must be dec and min 1").isInt({ min: 1 }),
  body("count", "must be dec and min 1").isInt({ min: 1 }),
];

export const DeleteCart = [body("id", "must be dec and min 1").isInt({ min: 1 })];
