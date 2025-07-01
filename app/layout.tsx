import { AboutBrawlBoltPage } from "@/components/BrawlComponents/AboutBrawlBoltPage";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { PlayerDataProvider } from "@/lib/BrawlUtility/PlayerDataProvider";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BrawlBolt",
  description: "Brawl Stars Personalized Tracker and Statistical Analysis",
  keywords: [
    "Brawl Stars",
    "stats",
    "leaderboard",
    "tracking",
    "player profiles",
    "data",
    "api",
    "brawl",
    "Brawl Stars stats tracker",
    "Free Brawl Stars tracker",
    "Brawl Stars player statistics",
    "Brawl Stars profile viewer",
    "Player stats tracking",
    "Brawl Stars gameplay analytics",
    "Track Brawl Stars performance",
    "Brawl Stars free stats tool",
    "Brawl Stars stats graphs",
    "Brawl Stars data visualization",
    "Player stats graphs",
    "Win rate charts",
    "Best Brawlers for your playstyle",
    "Personalized Brawl Stars analysis",
    "Real-time Brawl Stars tracker",
    "Cached Brawl Stars stats",
    "Player profile pages",
    "Brawl Stars player insights",
    "Profile stats for Brawl Stars",
    "Best Brawlers for maps",
    "Analyze Brawler performance",
    "Brawler stats tracker",
    "Gem Grab stats",
    "Showdown analytics",
    "Brawl Ball tracker",
    "Map win rates",
    "Compare player stats",
    "Share your stats online",
    "Brawl Stars API",
    "Brawl Stars data caching",
    "Interactive game charts",
    "Stats powered by data",
    "Brawl Stars analytics tool",
    "Free player stats viewer",
    "Easy-to-use Brawl Stars tool",
    "Clean stats dashboard",
    "Mobile-friendly stats tracker",
    "Detailed Brawl Stars stat website"
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <Head>
        <title>BrawlBolt</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <PlayerDataProvider>

            <div className="flex flex-col items-center p-4">

              {/* Title */}
              <div className="w-full overflow-hidden">
                <Card className="mb-2 max-w-2xl text-center shadow-md p-6 mx-auto">
                  <h1 className="text-6xl font-bold mb-2 text-blue-700">
                    <Link href="/">BrawlBolt</Link>
                  </h1>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 relative">
                        <Image
                          src="/logo.png"
                          alt="Circular Logo"
                          className="rounded-full"
                          width={999}
                          height={999}
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col sm:justify-center sm:items-start">
                      <p className="text-2xl sm:text-3xl text-blue-700">
                        Lightning Fast Statistics
                      </p>
                    </div>
                  </div>
                </Card>

            </div>
          </div>

          {children}

          <Toaster />

          <AboutBrawlBoltPage />



        </PlayerDataProvider>
      </ThemeProvider>
    </body>
    </html >
  );
}
