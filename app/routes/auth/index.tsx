import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Image,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import logoN from "~/assets/images/logo-N.png";
import { Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import type { RegisterForm } from "~/utils/types.server";
import { validateRegister } from "~/utils/validator.server";
import { login, register } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const passwordHash = form.get("passwordHash");
  let confirmPassword = form.get("confirmPassword");
  const action = form.get("_action");

  if (
    typeof email !== "string" ||
    typeof passwordHash !== "string" ||
    typeof action !== "string"
  ) {
    return json({ success: false, message: "Invalid form data" }, 400);
  }

  if (action === "register" && typeof confirmPassword !== "string") {
    return json({ success: false, message: "Invalid form data" }, 400);
  }

  confirmPassword = confirmPassword as string;
  const { issues } = validateRegister({ email, passwordHash, confirmPassword });
  if (issues) {
    return json(
      {
        success: false,
        errors: issues[0].message,
      },
      400
    );
  }

  switch (action) {
    case "login": {
      return login({ email, passwordHash });
    }
    case "register": {
      confirmPassword = confirmPassword as string;
      return register({ email, passwordHash, confirmPassword });
    }
    default:
      return json({ success: false, message: "Invalid form data" }, 400);
  }
};

const Login = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    passwordHash: "",
    confirmPassword: "",
  });

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  const [action, setAction] = useState<string>("login");

  const handleActionChange = () => {
    let value: string;
    value = action === "login" ? "register" : "login";
    setFormData({ email: "", passwordHash: "", confirmPassword: "" });
    setAction(value);
  };
  return (
    <Paper
      withBorder
      shadow="md"
      p={30}
      radius="md"
      sx={(theme) => ({
        background:
          theme.colorScheme === "dark"
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.1)",
        backdropFilter: "blur(8px)",
        minWidth: "320px",
        margin: "auto",
      })}
    >
      <Center>
        <Image src={logoN} alt="logo" width={100} />
      </Center>
      <Center>
        <Title align="left" order={2}>
          {action === "login" ? "Sign in" : "Sign up"}
        </Title>
      </Center>
      <Space h="md" />
      <Form method="post">
        <TextInput
          name="email"
          label="Email"
          placeholder="Your email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => handleChangeInput(e, "email")}
          styles={(theme) => ({
            label: {
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.primaryColor
                  : "red",
            },
          })}
          required
        />
        <PasswordInput
          name="passwordHash"
          label="Password"
          placeholder="Your password"
          autoComplete="password"
          value={formData.passwordHash}
          onChange={(e) => handleChangeInput(e, "passwordHash")}
          styles={(theme) => ({
            label: {
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.primaryColor
                  : "red",
            },
          })}
          required
          mt="md"
        />
        {action !== "login" ? (
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Repeat password"
            autoComplete="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChangeInput(e, "confirmPassword")}
            styles={(theme) => ({
              label: {
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.primaryColor
                    : "red",
              },
            })}
            required
            mt="md"
          />
        ) : null}
        {action === "login" ? (
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" />
            <Anchor<"a">
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
        ) : null}
        <Button fullWidth mt="xl" name="_action" value={action} type="submit">
          {action === "login" ? "Sign in" : "Sign up"}
        </Button>
        <Divider
          my="xs"
          label={
            action === "login"
              ? "Dont have an account?"
              : "Already have an account?"
          }
          labelPosition="center"
        />
        <Button
          onClick={() => handleActionChange()}
          variant="outline"
          fullWidth
        >
          {action === "login" ? "Sign up" : "Sign in"}
        </Button>
      </Form>
    </Paper>
  );
};

export default Login;
