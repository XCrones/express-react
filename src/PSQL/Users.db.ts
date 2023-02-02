import { PoolPSQL } from "./DB";

interface IUserMake extends IUserDB {
  uid: number;
  createdat: Date;
  updatedat: Date;
}
export interface IUserDB {
  email: string;
  passwordhash: string;
  fullName: string;
  avatarUrl?: string | null;
}

export const getUserByIdDB = async (uid: string): Promise<IUserMake | undefined> => {
  const { rows } = await PoolPSQL.query("SELECT * FROM users where uid = $1", [uid]);
  return rows[0];
};

export const searchUserByEmailDB = async (email: string): Promise<IUserMake | undefined> => {
  const { rows } = await PoolPSQL.query("SELECT * FROM users where email = $1", [email]);
  return rows[0];
};

export const saveUserDB = async ({ email, passwordhash, fullName, avatarUrl }: IUserDB): Promise<IUserMake> => {
  try {
    const currDate = new Date();
    const result = await searchUserByEmailDB(email);

    if (!!result) {
      throw "email is busy";
    }

    const { rows } = await PoolPSQL.query(
      `INSERT INTO users (fullname, email, passwordHash, avatarUrl, createdAt, updatedAt)
      values ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [fullName, email, passwordhash, avatarUrl, currDate, currDate]
    );

    return rows[0];
  } catch (err) {
    throw err;
  }
};
