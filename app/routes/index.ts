import { requireUserId } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return redirect("/movie");
};
