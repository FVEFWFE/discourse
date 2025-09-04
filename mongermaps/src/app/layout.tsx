import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "~/components/providers";

export const metadata: Metadata = {
  title: "MongerMaps - The Bloomberg Terminal for Mongers",
  description: "Private intelligence service providing real-time data and insider knowledge for the sophisticated monger.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="font-sans antialiased bg-gray-950 text-gray-100">
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}