import { Anchor, BackgroundImage, Center, Image } from "@mantine/core";
import { Link, Outlet } from "@remix-run/react";
import bgImg from "~/assets/images/login.jpg";
import logo from "~/assets/Netflix_2015_logo.svg";

const Auth = () => {
  return (
    <BackgroundImage src={bgImg}>
      <Anchor component={Link} to='/auth/login'>
        <Image
          src={logo}
          alt='logo'
          width={120}
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            background: "rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
          }}
        />
      </Anchor>
      <Center style={{ minHeight: "100vh", width: "100%" }}>
        <Outlet />
      </Center>
    </BackgroundImage>
  );
};

export default Auth;
