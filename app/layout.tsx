import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Layer — Find people through trusted context",
  description:
    "Search an opt-in professional directory using plain language and transparent filters.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
