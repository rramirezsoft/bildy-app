import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: "fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
  weight: "400",
});

export const metadata = {
  title: "Bildy",
  description: "Delivery note management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
