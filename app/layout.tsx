import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Next Holiday Classic",
  description: "A Global Search for the Next Holiday Hit Song",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
