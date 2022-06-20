import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { constant } from "~/config/constant";

if (!constant.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "netflix-session",
    secure: constant.NODE_ENV === "production",
    secrets: [constant.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirecTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirecTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
