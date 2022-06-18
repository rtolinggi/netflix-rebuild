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
  const userExist = await prisma.user.count({
    where: {
      email: form.email,
    },
  });

  if (userExist) {
    return json(
      { success: false, message: "Email already exist" },
      { status: 400 }
    );
  }

  const newUser = await createUser(form);

  if (!newUser) {
    return json(
      {
        success: false,
        message: "Something went wrong trying to register user",
      },
      { status: 400 }
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
        message: "Invalid credentials",
      },
      { status: 400 }
    );
  }
  return createUserSession(user.id, "/movie");
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

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUsersession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth?${searchParams}`);
  }
  return userId;
};

const getUsersession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};
