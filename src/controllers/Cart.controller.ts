import * as DB from "../PSQL/Cart.db";
// import { CartModel, DeleteCartModel } from "../models/Cart.model.js";

// export const updateCart = async (req, res) => {
//   try {
//     const updateCartItem = CartModel({
//       uid: req.userId,
//       id: req.body.id,
//       count: req.body.count,
//     });

//     const result = await DB.patchCartDB(updateCartItem);

//     if (!!result) {
//       return res.status(400).json({
//         message: result,
//       });
//     }

//     return res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "невозможно обновить корзину",
//     });
//   }
// };

// export const pushCart = async (req, res) => {
//   try {
//     const newCartItem = CartModel({
//       uid: req.userId,
//       id: req.body.id,
//       count: req.body.count,
//     });

//     const result = await DB.setCartDB(newCartItem);

//     if (!!result) {
//       return res.status(400).json({
//         message: result,
//       });
//     }

//     return res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "невозможно добавить в корзину",
//     });
//   }
// };

// export const getCart = async (req, res) => {
//   try {
//     const result = await DB.getCartDB(req.userId);

//     if (!result) {
//       return res.status(404).json({
//         message: "user cart not found",
//       });
//     }

//     return res.json(result);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "невозможно получить корзину",
//     });
//   }
// };

// export const deleteCart = async (req, res) => {
//   try {
//     const deleteCartItem = DeleteCartModel({
//       uid: req.userId,
//       id: req.body.id,
//     });

//     const result = await DB.deleteCartDB(deleteCartItem);
//     if (!!result) {
//       return res.status(400).json({
//         message: result,
//       });
//     }

//     return res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "невозможно удалить продукт из корзины",
//     });
//   }
// };
