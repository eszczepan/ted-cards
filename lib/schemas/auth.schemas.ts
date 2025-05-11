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

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ResetPasswordFormState = {
  status: "idle" | "success" | "error";
  errors: {
    email?: string[];
    _form?: string[];
  };
  message?: string;
  formValues?: {
    email?: string;
  };
};

export const INITIAL_RESET_PASSWORD_STATE: ResetPasswordFormState = {
  status: "idle",
  errors: {},
};

export const updatePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type UpdatePasswordFormState = {
  status: "idle" | "success" | "error";
  errors: {
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
  message?: string;
  formValues?: {
    newPassword?: string;
    confirmNewPassword?: string;
  };
};

export const INITIAL_UPDATE_PASSWORD_STATE: UpdatePasswordFormState = {
  status: "idle",
  errors: {},
};
