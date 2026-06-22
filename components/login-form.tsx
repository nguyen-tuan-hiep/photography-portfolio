"use client";
import { useActionState } from "react";
import { login } from "@/app/actions";
export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="mt-10 space-y-6">
      <label className="block text-xs uppercase tracking-wider">
        Email
        <input name="email" type="email" required className="field" />
      </label>
      <label className="block text-xs uppercase tracking-wider">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="field"
        />
      </label>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="button-dark w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
