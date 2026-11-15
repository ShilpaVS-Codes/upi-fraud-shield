
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafePay - UPI Fraud Shield",
  description: "Intelligent UPI Fraud Prevention System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
