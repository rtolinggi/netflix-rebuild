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
import { useState } from "react";
import logoN from "~/assets/images/logo-N.png";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

export type AuthForm = {
  emailOrphone: string;
  password: string;
  action: string;
};

const schema = z.object({
  emailOrPhone: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});

export const action: ActionFunction = async ({ request }) => {
  console.log(request);
  const form = await request.formData();
  const emailOrPhone = form.get("emailOrPhone");
  const password = form.get("password");
  const action = form.get("_action");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof emailOrPhone !== "string" || typeof password !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = { emailOrPhone, password, action };
  console.log(fields);
  return console.log(fields);
};

const Login = () => {
  const actionData = useActionData<FormData>();
  console.log(actionData);
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const [action, setAction] = useState<string>("login");

  const handleActionChange = () => {
    let value: string;
    value = action === "login" ? "register" : "login";
    form.reset();
    setAction(value);
  };
  return (
    <Paper
      withBorder
      shadow='md'
      p={30}
      radius='md'
      sx={(theme) => ({
        background:
          theme.colorScheme === "dark"
            ? "rgba(0,0,0,0.7)"
            : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(8px)",
        minWidth: "320px",
        margin: "auto",
      })}>
      <Center>
        <Image src={logoN} alt='logo' width={100} />
      </Center>
      <Center>
        <Title align='left' order={2}>
          {action === "login" ? "Sign in" : "Sign up"}
        </Title>
      </Center>
      <Space h='md' />
      <Form method='post'>
        <TextInput
          label='Email or Phone'
          placeholder='Your email or phone'
          {...form.getInputProps("emailOrPhone")}
          autoComplete='emailOrPhone'
          required
        />
        <PasswordInput
          label='Password'
          placeholder='Your password'
          {...form.getInputProps("password")}
          autoComplete='password'
          required
          mt='md'
        />
        {action === "login" ? (
          <Group position='apart' mt='md'>
            <Checkbox label='Remember me' />
            <Anchor<"a">
              onClick={(event) => event.preventDefault()}
              href='#'
              size='sm'>
              Forgot password?
            </Anchor>
          </Group>
        ) : null}
        <Button fullWidth mt='xl' name='_action' value={action} type='submit'>
          {action === "login" ? "Sign in" : "Sign up"}
        </Button>
        <Divider
          my='xs'
          label={
            action === "login"
              ? "Dont have an account?"
              : "Already have an account?"
          }
          labelPosition='center'
        />
        <Button
          onClick={() => handleActionChange()}
          variant='outline'
          fullWidth>
          {action === "login" ? "Sign up" : "Sign in"}
        </Button>
      </Form>
    </Paper>
  );
};

export default Login;
