import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test App - Strapi NextGen Framework",
  description: "E2E test application for Strapi NextGen Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
