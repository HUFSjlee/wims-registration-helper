"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type HeaderLink = { href: string; label: string };

type WebPageProps = {
  title: string;
  rightText?: string;
  headerLinks?: HeaderLink[];
  children: ReactNode;
};

export function WebPage({ title, rightText, headerLinks, children }: WebPageProps) {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="mx-auto w-full max-w-[1280px] rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
        <header className="mb-4 flex h-14 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            {headerLinks?.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900 hover:underline">
                {item.label}
              </Link>
            ))}
            {rightText ? <span className="text-slate-500">{rightText}</span> : null}
          </nav>
        </header>
        {children}
      </section>
    </main>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`.trim()}>
      {children}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${error ? "border-red-500" : ""} ${className}`.trim()}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = "flex h-11 w-full items-center justify-center rounded-lg text-sm font-bold transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-slate-800 hover:bg-gray-300",
    outline: "border-2 border-gray-300 bg-white text-slate-700 hover:bg-gray-50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
