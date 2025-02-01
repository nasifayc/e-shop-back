import jwt from "jsonwebtoken";

const accessToken = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, accessToken, { expiresIn: "10m" });
};
