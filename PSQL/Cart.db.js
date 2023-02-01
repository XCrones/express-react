import { PoolPSQL } from "./db.js";

const searchUser = async (uid) => {
  try {
    const result = (await PoolPSQL.query("SELECT * FROM cart where uid = $1", [uid])).rows[0];
    return result;
  } catch (err) {
    throw err;
  }
};

export const setCartDB = async ({ uid, product }) => {
  try {
    const userCart = await searchUser(uid);
    const dateNow = new Date();
    const makeItem = [product.id, product.count];

    if (!!userCart) {
      const findItem = userCart.id_count.find((item) => item[0] === product.id);
      if (!!findItem) {
        return "item is available, use patch";
      }

      await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
        [...userCart.id_count, makeItem],
        dateNow,
        uid,
      ]);

      return;
    }

    await PoolPSQL.query("INSERT INTO cart (uid, id_count, createdAt, updatedAt) values ( $1, $2, $3, $4 )", [
      uid,
      [makeItem],
      dateNow,
      dateNow,
    ]);
  } catch (err) {
    throw err;
  }
};

export const patchCartDB = async ({ uid, product }) => {
  try {
    const dateNow = new Date();
    const userCart = await searchUser(uid);
    const findIndex = userCart.id_count.findIndex((item) => item[0] === product.id);

    if (findIndex >= 0) {
      userCart.id_count[findIndex][1] = product.count;

      await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
        userCart.id_count,
        dateNow,
        uid,
      ]);
      return;
    }

    return "purhase not found";
  } catch (err) {
    throw err;
  }
};

export const getCartDB = async (uid) => {
  try {
    const userCart = await searchUser(uid);
    if (!!userCart) {
      const makeCart = {
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

export const deleteCartDB = async ({ uid, product }) => {
  try {
    const dateNow = new Date();
    const userCart = await searchUser(uid);
    const filteredItems = userCart.id_count.filter((item) => item[0] !== product.id);

    if (filteredItems.length === userCart.id_count.length) {
      return "item not found";
    }

    if (filteredItems) {
      await PoolPSQL.query("UPDATE cart SET id_count = $1, updatedAt = $2 WHERE uid = $3", [
        filteredItems,
        dateNow,
        uid,
      ]);
      return;
    }

    return "purhases not found";
  } catch (err) {
    throw err;
  }
};
