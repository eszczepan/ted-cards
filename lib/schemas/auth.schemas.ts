import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormState = {
  status: "idle" | "success" | "error";
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
  formValues?: {
    email?: string;
    password?: string;
  };
};

export const INITIAL_LOGIN_STATE: LoginFormState = {
  status: "idle",
  errors: {},
};

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormState = {
  status: "idle" | "success" | "error";
  errors: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  message?: string;
  formValues?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export const INITIAL_REGISTER_STATE: RegisterFormState = {
  status: "idle",
  errors: {},
};
