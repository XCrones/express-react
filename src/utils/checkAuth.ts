import express from "express";

import { verify } from "jsonwebtoken";
import { makeMessage } from "./../controllers/Message";
import { IUserId } from "../controllers/Cart.controller";
import { TypedRequestBody, TypedResponseBody } from "../models/HttpQuery.model";

interface IToket {
  uid: string;
  iat: any;
  exp: any;
}

export default async (req: TypedRequestBody<IUserId>, res: TypedResponseBody, next: express.NextFunction) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(403).json(makeMessage("no access"));
  }

  try {
    const verifyToken = verify(token, "secret") as IToket;
    req.body.uid = verifyToken.uid;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json(makeMessage("error token"));
  }
};
