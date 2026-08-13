import { Suspense } from "react";
import LoginForm from "./ui";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-navy text-white">TeleCore</div>}>
      <LoginForm />
    </Suspense>
  );
}
