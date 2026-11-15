"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action}>
      <label htmlFor="password">Passwort</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
      />
      <button type="submit" className="btn-accent" disabled={pending}>
        {pending ? "Prüfe …" : "Anmelden"}
      </button>
      {state?.error && <div className="login-error" role="alert">{state.error}</div>}
    </form>
  );
}
