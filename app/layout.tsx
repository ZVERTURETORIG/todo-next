import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Список задач",
  description: "Простой список задач.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
