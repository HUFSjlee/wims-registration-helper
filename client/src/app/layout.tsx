import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MockAuthProvider } from "../contexts/MockAuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIMS Registration Helper",
  description: "WIMS registration helper web UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <MockAuthProvider>{children}</MockAuthProvider>
      </body>
    </html>
  );
}
