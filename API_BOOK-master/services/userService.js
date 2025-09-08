import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function createUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  return user.save();
}
