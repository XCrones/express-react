import * as DB from "../PSQL/Cart.db";
import { TypedRequestBody, TypedResponseBody } from "../models/HttpQuery.model";
import { ICartDb, ICartDeleteDb } from "../PSQL/Cart.db";
import { makeMessage } from "./Message";

export interface IUserId {
  uid: string;
}

interface iUpdateCartReq extends IUserId {
  id: number;
  count: number;
}

export const updateCart = async (req: TypedRequestBody<iUpdateCartReq>, res: TypedResponseBody) => {
  try {
    const updateCartItem: ICartDb = {
      uid: req.body.uid,
      product: {
        id: req.body.id,
        count: req.body.count,
      },
    };

    const result = await DB.patchCartDB(updateCartItem);

    if (!!result) {
      return res.status(400).json(makeMessage(result));
    }

    return res.json(makeMessage("success"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(makeMessage("err update cart"));
  }
};

export const pushCart = async (req: TypedRequestBody<iUpdateCartReq>, res: TypedResponseBody) => {
  try {
    const newCartItem: ICartDb = {
      uid: req.body.uid,
      product: {
        id: req.body.id,
        count: req.body.count,
      },
    };

    const result = await DB.setCartDB(newCartItem);

    if (!!result) {
      return res.status(400).json(makeMessage(result));
    }

    return res.json(makeMessage("success"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(makeMessage("err push cart"));
  }
};

export const getCart = async (req: TypedRequestBody<{ uid: string }>, res: TypedResponseBody) => {
  try {
    const result = await DB.getCartDB(req.body.uid);

    if (!result) {
      return res.status(404).json(makeMessage("user cart not found"));
    }

    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json(makeMessage("cant get user cart"));
  }
};

export const deleteCart = async (req: TypedRequestBody<{ uid: string; id: number }>, res: TypedResponseBody) => {
  try {
    const deleteCartItem: ICartDeleteDb = {
      uid: req.body.uid,
      product: {
        id: req.body.id,
      },
    };

    const result = await DB.deleteCartDB(deleteCartItem);

    if (!!result) {
      return res.status(400).json(makeMessage(result));
    }

    return res.json(makeMessage("success"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(makeMessage("err delete item"));
  }
};
