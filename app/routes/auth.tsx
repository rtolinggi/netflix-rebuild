import {
  Anchor,
  BackgroundImage,
  Box,
  Center,
  Group,
  Image,
} from "@mantine/core";
import { Link, Outlet } from "@remix-run/react";
import bgImg from "~/assets/images/login.jpg";
import logo from "~/assets/Netflix_2015_logo.svg";
import DarkMode from "~/components/DarkMode";
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getUser } from "~/models/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await getUser(request);
  console.log(auth);
  return auth ? redirect("/movie") : null;
};
const Auth = () => {
  return (
    <BackgroundImage src={bgImg} style={{ opacity: "80%" }}>
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background:
            theme.colorScheme === "dark"
              ? "rgba(0,0,0,0.8)"
              : "rgba(255,255,255,0.05)",
        })}></Box>
      <Group
        position='apart'
        style={{
          position: "absolute",
          width: "100%",
          top: 15,
          padding: "0 1rem",
        }}>
        <Anchor component={Link} to='/auth/login'>
          <Image src={logo} alt='logo' width={120} />
        </Anchor>
        <DarkMode variant='filled' size={25} />
      </Group>

      <Center style={{ minHeight: "100vh", width: "100%" }}>
        <Outlet />
      </Center>
    </BackgroundImage>
  );
};

export default Auth;
