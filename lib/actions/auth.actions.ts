"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/supabase.server";
import {
  loginSchema,
  LoginFormState,
  registerSchema,
  RegisterFormState,
  resetPasswordSchema,
  ResetPasswordFormState,
  updatePasswordSchema,
  UpdatePasswordFormState,
} from "@/lib/schemas/auth.schemas";

export async function login(_prevState: LoginFormState, formData: FormData) {
  const rawFormValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = loginSchema.safeParse(rawFormValues);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid login details. Please check the form for errors.",
      formValues: rawFormValues,
    } as LoginFormState;
  }

  const { email, password } = validatedFields.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const isInvalidCredentials =
        error.message.includes("Invalid login credentials") || error.message.includes("Invalid email or password");

      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
        message: "Login failed. Please check your credentials.",
        ...(isInvalidCredentials ? {} : { formValues: rawFormValues }),
      } as LoginFormState;
    }
  } catch (err) {
    console.log(err);
    return {
      status: "error",
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      message: "Something went wrong. Please try again later.",
      formValues: rawFormValues,
    } as LoginFormState;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(_prevState: RegisterFormState, formData: FormData) {
  const rawFormValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedFields = registerSchema.safeParse(rawFormValues);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid registration details. Please check the form for errors.",
      formValues: rawFormValues,
    } as RegisterFormState;
  }

  const { email, password } = validatedFields.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
        message: "Registration failed. Please try again.",
        formValues: rawFormValues,
      } as RegisterFormState;
    }

    return {
      status: "success",
      errors: {},
      message: "Registration successful!",
      formValues: { email },
    } as RegisterFormState;
  } catch {
    return {
      status: "error",
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      message: "Something went wrong. Please try again later.",
      formValues: rawFormValues,
    } as RegisterFormState;
  }
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(_prevState: ResetPasswordFormState, formData: FormData) {
  const rawFormValues = {
    email: formData.get("email") as string,
  };

  const validatedFields = resetPasswordSchema.safeParse(rawFormValues);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please enter a valid email address.",
      formValues: rawFormValues,
    } as ResetPasswordFormState;
  }

  const { email } = validatedFields.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
      } as ResetPasswordFormState;
    }

    return {
      status: "success",
      errors: {},
      message: "If an account with that email exists, a reset link has been sent.",
    } as ResetPasswordFormState;
  } catch {
    return {
      status: "error",
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      message: "Something went wrong. Please try again later.",
      formValues: rawFormValues,
    } as ResetPasswordFormState;
  }
}

export async function updatePassword(_prevState: UpdatePasswordFormState, formData: FormData) {
  const rawFormValues = {
    newPassword: formData.get("newPassword") as string,
    confirmNewPassword: formData.get("confirmNewPassword") as string,
  };

  const validatedFields = updatePasswordSchema.safeParse(rawFormValues);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check the form for errors.",
      formValues: rawFormValues,
    } as UpdatePasswordFormState;
  }

  const { newPassword } = validatedFields.data;
  const code = formData.get("code") as string;

  if (!code) {
    return {
      status: "error",
      errors: { _form: ["Invalid or missing reset code. Check your email for the reset link."] },
      message: "Invalid or missing reset code. Check your email for the reset link.",
      formValues: rawFormValues,
    } as UpdatePasswordFormState;
  }

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return {
        status: "error",
        errors: { _form: ["Invalid or expired reset code. Please request a new reset link."] },
        message: "Invalid or expired reset code. Please request a new reset link.",
        formValues: rawFormValues,
      } as UpdatePasswordFormState;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return {
        status: "error",
        errors: { _form: [error.message] },
        message: "Failed to update password.",
        formValues: rawFormValues,
      } as UpdatePasswordFormState;
    }
    return {
      status: "success",
      errors: {},
      message: "Password updated successfully. You can now log in.",
    } as UpdatePasswordFormState;
  } catch {
    return {
      status: "error",
      errors: { _form: ["An unexpected error occurred. Please try again."] },
      message: "Something went wrong. Please try again later.",
      formValues: rawFormValues,
    } as UpdatePasswordFormState;
  }
}
