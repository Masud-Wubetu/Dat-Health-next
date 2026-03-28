import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAT Healthcare",
  description: "A telemedicine app where patient meetwith doctor virtually",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
