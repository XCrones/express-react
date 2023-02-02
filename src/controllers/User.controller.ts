import { makeMessage } from "./Message";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TypedRequestBody, TypedResponseBody } from "../models/HttpQuery.model";
import { IUserId } from "./Cart.controller";
import { IUserDB, getUserByIdDB, saveUserDB, searchUserByEmailDB } from "../PSQL/Users.db";
import { IUserSignIn, IUserSignUp } from "../models/User.model";

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const makeTokenSign = (uid: number) => {
  return jwt.sign(
    {
      uid: uid,
    },
    "secret",
    {
      expiresIn: "30d",
    }
  );
};

export const signUp = async (req: TypedRequestBody<IUserSignUp>, res: TypedResponseBody) => {
  try {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      return res.status(400).json(erros.array());
    }

    const passwordhash = await encryptPassword(req.body.password);

    const newUsers: IUserDB = {
      email: req.body.email,
      passwordhash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl || null,
    };

    const result = await saveUserDB(newUsers);

    const { passwordhash: password, ...userData } = result;

    const token = makeTokenSign(result.uid);

    return res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    if (err === "email is busy") {
      return res.status(400).json(makeMessage("email is busy"));
    }
    return res.status(500).json("Не удалось зарегистрироваться");
  }
};

export const signIn = async (req: TypedRequestBody<IUserSignIn>, res: TypedResponseBody) => {
  try {
    const result = await searchUserByEmailDB(req.body.email);

    if (!result) {
      return res.status(400).json(makeMessage("wrong login ")); //or password
    }

    const isValidPass = await bcrypt.compare(req.body.password, result.passwordhash);

    if (!isValidPass) {
      return res.status(400).json(makeMessage("wrong  password")); //login or
    }

    const token = makeTokenSign(result.uid);

    const { passwordhash, ...userData } = result;

    return res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(makeMessage("error signin"));
  }
};

export const getMe = async (req: TypedRequestBody<IUserId>, res: TypedResponseBody) => {
  try {
    const result = await getUserByIdDB(req.body.uid);

    if (!result) {
      return res.status(404).json(makeMessage("user not found"));
    }

    const { passwordhash: password, ...userData } = result;

    return res.json({
      ...userData,
    });
  } catch (err) {
    return res.status(500).json(makeMessage("no access"));
  }
};
