import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Emergencia 2026",
  description: "Centro de comando para gestión de donaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
