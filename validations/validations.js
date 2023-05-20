//8. "npm install express-validator" .then create holder validations=>validations.js

import { body } from "express-validator";

export const registerValidation = [
  body("email", "not correct email").isEmail(),
  body("password", "password should be in 5 symbols").isLength({ min: 5 }),
  body("fullName", "name should be min 3 symbols").isLength({ min: 3 }),
  body("avatarUrl", "not correct link to avatar").optional().isString(),
];

export const loginValidation = [
  body("email", "not correct email").isEmail(),
  body("password", "password should be in 5 symbols").isLength({ min: 5 }),
];

export const postCreateValidation = [
  body("title", "enter title").isLength({ min: 3 }).isString(),
  body("text", "enter post text").isLength({ min: 5 }).isString(),
  body("tags", "not correct tags format").optional().isArray(),
  body("imagerUrl", "not correct link to image").optional().isString(),
];

export const commentCreateValidation = [
  body("text", "enter comment text").isLength({ min: 1 }).isString(),
];
