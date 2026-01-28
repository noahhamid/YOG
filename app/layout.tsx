import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google"; // Modern fashion fonts
import "./globals.css";

// Setting up our Vexo/Editorial fonts
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "YOG | Your Outfit Goal",
  description: "Ethiopia's premier digital fashion mall.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} font-sans antialiased bg-[#F9F8F6]`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
