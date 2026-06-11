"use client";

import { loginAction } from "@/actions/login";
import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/shared/text-input";
import { useActionState } from "react";

const initialState = { error: undefined as string | undefined };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white bg-black p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Cervecería POS
        </h1>

        <form action={formAction} className="flex flex-col gap-4">
          <Input
            id="username"
            name="username"
            label="Usuario"
            type="text"
            required
            autoComplete="username"
          />

          <PasswordInput
            id="password"
            name="password"
            label="Contraseña"
            required
            autoComplete="current-password"
          />

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-200 disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
