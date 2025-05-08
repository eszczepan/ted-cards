"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/supabase.server";
import { loginSchema, LoginFormState, registerSchema, RegisterFormState } from "@/lib/schemas/auth.schemas";

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

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch {
    return {
      status: "error",
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      message: "Something went wrong. Please try again later.",
      formValues: rawFormValues,
    } as LoginFormState;
  }
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
