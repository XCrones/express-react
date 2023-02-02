import { ICart, ICartDelete } from "../models/Cart.model";
import { PoolPSQL } from "./DB";

export interface ICartDb {
  uid: string;
  product: ICart;
}

export interface ICartDeleteDb {
  uid: string;
  product: ICartDelete;
}

interface ICartItem {
  id: number;
  uid: string;
  id_count: number[][];
  createdAt: Date;
  updatedAt: Date;
}

interface ICartItemUpdate {
  uid: string;
  id_count: number[];
  updatedAt: Date;
}

interface ICartItemSet extends ICartItemUpdate {
  createdAt: Date;
}

interface IParsingCart {
  cart: ICart[];
}

const searchUser = async (uid: string): Promise<ICartItem | undefined> => {
  try {
    const result = (await PoolPSQL.query("SELECT * FROM cart where uid = $1", [uid])).rows[0];
    return result;
  } catch (err) {
    throw err;
  }
};

export const setCartDB = async ({ uid, product: { count, id } }: ICartDb) => {
  try {
    const userCart = await searchUser(uid);

    if (!!userCart) {
      const findItem = userCart.id_count.find((item: number[]) => item[0] === id);

      if (!!findItem) {
        return "item is available, use patch";
      }

      const cartItemUpdate: ICartItemUpdate = {
        uid: userCart.uid,
        id_count: [id, count],
        updatedAt: new Date(),
      };

      await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
        [...userCart.id_count, cartItemUpdate.id_count],
        cartItemUpdate.updatedAt,
        cartItemUpdate.uid,
      ]);

      return;
    }

    const currDate = new Date();

    const cartItemSet: ICartItemSet = {
      uid: uid,
      id_count: [id, count],
      updatedAt: currDate,
      createdAt: currDate,
    };

    await PoolPSQL.query("INSERT INTO cart (uid, id_count, createdAt, updatedAt) values ( $1, $2, $3, $4 )", [
      uid,
      [cartItemSet.id_count],
      cartItemSet.createdAt,
      cartItemSet.updatedAt,
    ]);
  } catch (err) {
    throw err;
  }
};

export const patchCartDB = async ({ uid, product: { id, count } }: ICartDb) => {
  try {
    const currDate = new Date();
    const userCart = await searchUser(uid);

    if (!!userCart) {
      const findIndex = userCart.id_count.findIndex((item) => item[0] === id);

      if (findIndex >= 0) {
        userCart.id_count[findIndex][1] = count;

        await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
          userCart.id_count,
          currDate,
          uid,
        ]);
        return;
      }
    }

    return "purhase not found";
  } catch (err) {
    throw err;
  }
};

export const getCartDB = async (uid: string) => {
  try {
    const userCart = await searchUser(uid);
    if (!!userCart) {
      const makeCart: IParsingCart = {
        cart: [],
      };

      userCart.id_count.forEach((item) => {
        makeCart.cart.push({
          id: item[0],
          count: item[1],
        });
      });

      return makeCart;
    }

    return false;
  } catch (err) {
    throw err;
  }
};

export const deleteCartDB = async ({ uid, product: { id } }: ICartDeleteDb) => {
  try {
    const currDate = new Date();
    const userCart = await searchUser(uid);

    if (!!userCart) {
      const filteredItems = userCart.id_count.filter((item) => item[0] !== id);

      if (filteredItems.length === userCart.id_count.length) {
        return "item not found";
      }

      if (filteredItems) {
        await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
          filteredItems,
          currDate,
          uid,
        ]);
        return;
      }
    }

    return "purhases not found";
  } catch (err) {
    throw err;
  }
};
