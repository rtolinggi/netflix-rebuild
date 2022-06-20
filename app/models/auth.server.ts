import { json, redirect } from "@remix-run/node";
import { prisma } from "../utils/prisma.server";
import type { RegisterForm, LoginForm } from "../utils/types.server";
import { createUser } from "./users.server";
import bcrypt from "bcryptjs";
import { createUserSession, storage } from "~/utils/session.server";
import { constant } from "~/config/constant";
import createTtansporter from "~/utils/email.server";

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

  createTtansporter(
    newUser.email,
    "Verification User",
    `
    <h3><b>Please Clink link in bottom</b></h3>
  `
  );

  return json(
    {
      success: true,
      message:
        "Register Success, Please Check youre email to activation account",
    },
    { status: 200 }
  );
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

  if (!constant.EMAIL_VERIFICATION) {
    if (!user.isVerified) {
      return json(
        {
          success: false,
          message:
            "Please verification email, check youre email to activate user",
        },
        { status: 400 }
      );
    }
  }

  return createUserSession(user.id, "/movie");
};

export const logout = async (request: Request) => {
  const session = await getUsersession(request);
  return redirect("/auth", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
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

const getUserId = async (request: Request) => {
  const session = await getUsersession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: true },
    });
    return user;
  } catch (error) {
    throw logout(request);
  }
};
