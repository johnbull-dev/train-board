import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Train Station Information",
  description: "Train Station Information lookup tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
