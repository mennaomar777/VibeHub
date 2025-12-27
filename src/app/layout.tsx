"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import Navbar from "./_components/navbar/Navbar";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Toaster } from "react-hot-toast";
import Footer from "./_components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="auto">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} disableTransitionOnChange>
            <Provider store={store}>
              <Navbar />
              <main suppressHydrationWarning>{children}</main> <Footer />
              <Toaster
                position="top-right"
                gutter={16}
                containerStyle={{ top: 80 }}
              />
            </Provider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
