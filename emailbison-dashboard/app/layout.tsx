import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmailBison Analytics Dashboard",
  description: "Comprehensive email campaign analytics and performance tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
