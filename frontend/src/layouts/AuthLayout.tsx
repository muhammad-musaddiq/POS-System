import { Outlet } from "react-router-dom";
export function AuthLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md">
        <Outlet />
      </section>
    </main>
  );
}
