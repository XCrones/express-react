import { PoolPSQL } from "./DB";

export const getUserByIdDB = async (uid: string) => {
  const { rows } = await PoolPSQL.query("SELECT * FROM users where id = $1", [uid]);
  return rows[0];
};

// export const searchUserByEmailDB = async (email) => {
//   const { rows } = await PoolPSQL.query("SELECT * FROM users where email = $1", [email]);
//   return rows[0];
// };

// export const saveUserDB = async ({ email, passwordHash, fullName, avatarUrl }) => {
//   try {
//     const dateNow = new Date();
//     const result = await searchUserByEmailDB(email);

//     if (!!result) {
//       return false;
//     }

//     const { rows } = await PoolPSQL.query(
//       `INSERT INTO users (fullname, email, passwordHash, avatarUrl, createdAt, updatedAt)
//       values ($1, $2, $3, $4, $5, $6) RETURNING *`,
//       [fullName, email, passwordHash, avatarUrl, dateNow, dateNow]
//     );

//     return rows[0];
//   } catch (err) {
//     throw err;
//   }
// };
