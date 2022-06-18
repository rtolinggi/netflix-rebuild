import { getUser } from "~/utils/auth.server";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const isAuth = await getUser(request);
  return isAuth ? redirect("/movie") : redirect("/auth");
};
