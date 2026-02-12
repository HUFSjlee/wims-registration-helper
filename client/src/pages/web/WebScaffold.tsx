import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type HeaderLink = { to: string; label: string };

type WebPageProps = {
  title: string;
  rightText?: string;
  headerLinks?: HeaderLink[];
  children: ReactNode;
};

export function WebPage({ title, rightText, headerLinks, children }: WebPageProps) {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="mx-auto w-full max-w-[1280px] rounded-2xl border border-gray-300 bg-gray-100 p-5">
        <header className="mb-4 flex h-16 items-center justify-between rounded-xl border border-gray-300 bg-white px-5">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            {headerLinks?.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
            {rightText ? <span>{rightText}</span> : null}
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-300 bg-white p-4 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function InputMock({ className = "" }: { className?: string }) {
  return <div className={`h-10 rounded-lg border border-gray-300 bg-gray-50 ${className}`.trim()} />;
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
    >
      {children}
    </button>
  );
}
