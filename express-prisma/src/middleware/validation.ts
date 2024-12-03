import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  //   .isStrongPassword({minLength: 6, minLowercase:1, minUppercase: 1, minSymbols: 1}),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Password not match");
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array });
    }
    next();
  },
];
