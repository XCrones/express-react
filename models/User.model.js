export const UserModel = ({ email, passwordHash, fullName, avatarUrl }) => {
  return {
    email,
    passwordHash,
    fullName,
    avatarUrl: avatarUrl || "",
  };
};
