import { requireUserId } from "~/utils/auth.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const IndexRoute = () => {
  return null;
};

export default IndexRoute;
