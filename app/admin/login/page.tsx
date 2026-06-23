import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
export const metadata = { title: "Admin Login" };
export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center bg-ink p-5">
      <div className="absolute right-5 top-5">
        <ThemeToggle inverted />
      </div>
      <div className="w-full max-w-md bg-paper p-8 sm:p-12">
        <p className="eyebrow">Frames by Hiep</p>
        <h1 className="mt-3 font-serif text-5xl">Welcome back.</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Sign in to manage your portfolio.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
