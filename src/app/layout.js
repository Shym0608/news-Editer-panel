import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Dynamic base URL for local & production
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Gujarat News",
    template: "%s | Gujarat News",
  },
  description:
    "Latest Gujarat news, breaking stories, digital news videos, and live updates from Gujarat.",
  icons: {
    icon: "/newslogo.jpeg",
    shortcut: "/newslogo.jpeg",
    apple: "/newslogo.jpeg",
  },
  openGraph: {
    title: "Gujarat News",
    description:
      "Latest Gujarat news, breaking stories, digital news videos, and live updates.",
    url: baseUrl,
    siteName: "Gujarat News",
    images: [
      {
        url: `${baseUrl}/newslogo.jpeg`,
        width: 512,
        height: 512,
        alt: "Gujarat News Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontFamily: "var(--font-geist-sans)",
              borderRadius: "8px",
              padding: "12px 16px",
              background: "#163b73",
              color: "#fff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
