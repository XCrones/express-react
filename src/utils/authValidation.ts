import express from "express";

import { makeMessage } from "./../controllers/Message";
import { validationResult } from "express-validator";
import { getUserByIdDB } from "../PSQL/Users.db";
import { TypedRequestBody, TypedResponseBody } from "../models/HttpQuery.model";
import { IUserId } from "../controllers/Cart.controller";

export default async (req: TypedRequestBody<IUserId>, res: TypedResponseBody, next: express.NextFunction) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(400).json(erros.array());
  }

  const validUser = await getUserByIdDB(req.body.uid);

  if (!validUser) {
    return res.status(404).json(makeMessage("user not found"));
  }

  next();
};
