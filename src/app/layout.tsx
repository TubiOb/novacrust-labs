import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { clashDisplay } from "@/components/ui/fonts";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Novacrust Crypto checkout",
  description: "Novacrust crypto-payment checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${clashDisplay.variable}`} suppressHydrationWarning >
      <body className='font-outfit' suppressHydrationWarning>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <main className="min-h-screen bg-gray-50 flex items-center justify-center p-0 lg:p-4">
            <div className="w-full max-w-xl p-2 lg:p-4 flex items-center justify-center">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
