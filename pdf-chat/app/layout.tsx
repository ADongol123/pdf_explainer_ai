// "use client";

import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/lib/ReactQueryProvider";
// import { useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Chat App",
  description: "Chat with your PDF documents using AI",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* <QueryClientProvider client={queryClient}> */}
            {children}
          </Providers>
          {/* </QueryClientProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
