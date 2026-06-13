import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F7FAFF] px-6">
      <section className="w-full max-w-md rounded-md border border-[#0033A0]/10 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">Einloggen</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Nur angemeldete Benutzer können Slides, Medien und Quellen bearbeiten.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
