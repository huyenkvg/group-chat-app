import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Group chat app",
  description: "Group chat application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableColorScheme={false}
          storageKey="group_chat_app--theme"
          >
          {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
