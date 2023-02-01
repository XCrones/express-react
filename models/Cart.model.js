export const CartModel = ({ uid, id, count }) => {
  return {
    uid,
    product: {
      id,
      count,
    },
  };
};

export const DeleteCartModel = ({ uid, id }) => {
  return {
    uid,
    product: {
      id,
    },
  };
};
