import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/nav-footer/navbar";
import Footer from "@/nav-footer/footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Navbar/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
