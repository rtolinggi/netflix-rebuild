import { Button, Center, Container, Stack, Title } from "@mantine/core";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { logout } from "~/controllers/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (typeof action !== "string") {
    return json({ success: false }, { status: 400 });
  }

  if (action === "logout") {
    return logout(request);
  }

  return null;
};

const MovieIndex = () => {
  return (
    <Container>
      <Stack>
        <Center>
          <Title order={4}>Nested Router</Title>;
        </Center>
        <Stack>
          <Form method='post'>
            <Button type='submit' name='_action' value='logout'>
              Logout
            </Button>
          </Form>
        </Stack>
      </Stack>
    </Container>
  );
};

export default MovieIndex;
