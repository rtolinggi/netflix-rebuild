import { prisma } from "../utils/prisma.server";
import type { RegisterForm } from "../utils/types.server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const createUser = async (user: RegisterForm) => {
  const { email, passwordHash } = user;
  const _passwordHash = await bcrypt.hash(passwordHash, 10);
  let token = crypto.randomBytes(32).toString("hex");
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash: _passwordHash,
      profile: {
        avatar: "avatar.jpg",
      },
      verifiedEmail: {
        create: {
          token,
        },
      },
    },
  });
  return {
    id: newUser.id,
    email: newUser.email,
    token: token,
  };
};

export const verifiedEmail = async (token: string) => {
  let idEmail = await prisma.verifiedEmail.findFirst({ where: { token } });
  let verified = await prisma.user.update({
    where: {
      id: idEmail?.userId,
    },
    data: {
      isVerified: true,
    },
  });
  return {
    id: verified.id,
    email: verified.email,
    verified: verified.isVerified,
  };
};
