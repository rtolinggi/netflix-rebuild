import { Center, Container, Title } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const Movie = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}>
      <Center>
        <Title>Movie Pages</Title>
      </Center>
      <Center>
        <Outlet />
      </Center>
    </Container>
  );
};

export default Movie;
