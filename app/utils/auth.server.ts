import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import type { RegisterForm, LoginForm } from "./types.server";
import { createUser } from "./users.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "netflix-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const register = async (form: RegisterForm) => {
  if (form.passwordHash !== form.confirmPassword) {
    return json({
      success: false,
      message: "Password not match",
    });
  }

  const userExist = await prisma.user.count({
    where: {
      email: form.email,
    },
  });

  if (userExist) {
    return json({ success: false, message: "Email already exist" }, 400);
  }

  const newUser = await createUser(form);

  if (!newUser) {
    return json(
      {
        success: false,
        message: "Something went wrong trying to register user",
        fields: {
          email: form.email,
          passowrd: form.passwordHash,
        },
      },
      400
    );
  }
  return createUserSession(newUser.id, "/");
};

export const login = async (form: LoginForm) => {
  const user = await prisma.user.findUnique({
    where: {
      email: form.email,
    },
  });

  if (!user || !(await bcrypt.compare(form.passwordHash, user.passwordHash))) {
    return json(
      {
        success: false,
        message: "Email not found",
      },
      401
    );
  }
  return createUserSession(user.id, "/");
};

export const createUserSession = async (userId: string, redirecTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirecTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
