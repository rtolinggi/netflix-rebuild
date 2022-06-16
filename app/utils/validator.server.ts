import { z } from "zod";
import type { RegisterForm } from "./types.server";

const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Not a valid email"),
  passwordHash: z
    .string({
      required_error: "Password is Required",
    })
    .min(6, { message: "Password must be 6 characters" }),
  confirmPassword: z
    .string({
      required_error: "Password is Required",
    })
    .min(6, { message: "Password must be 6 characters" }),
});

export const validateRegister = ({
  email,
  passwordHash,
  confirmPassword,
}: RegisterForm) => {
  try {
    registerSchema.parse({
      email,
      passwordHash,
      confirmPassword,
    });
    return null;
  } catch (error) {
    return error;
  }
};
