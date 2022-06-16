import { prisma } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import bcrypt from "bcryptjs";

export const createUser = async (user: RegisterForm) => {
  const { email, passwordHash } = user;
  const _passwordHash = await bcrypt.hash(passwordHash, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash: _passwordHash,
      profile: {
        avatar: "avatar.jpg",
      },
    },
  });
  return {
    id: newUser.id,
    email: newUser.email,
  };
};
