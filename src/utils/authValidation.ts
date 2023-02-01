import { validationResult } from "express-validator";
import { getUserByIdDB } from "../PSQL/Users.db";

// export default async (req, res, next) => {
//   const erros = validationResult(req);

//   if (!erros.isEmpty()) {
//     return res.status(400).json(erros.array());
//   }

//   const validUser = await getUserByIdDB(req.userId);

//   if (!validUser) {
//     return res.status(404).json({
//       message: "user not found",
//     });
//   }

//   next();
// };
