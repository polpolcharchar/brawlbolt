"use client"

import { VerificationCard } from "@/components/BrawlComponents/InfoCards/VerificationCard";

export default function UserPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-(--foreground)">Verify Your Brawl Stars Account</h1>
        <p className="text-lg text-(--muted-foreground)">
          Get access to all of BrawlBolt's features
        </p>
      </div>

      <VerificationCard/>
    </div>
  );
}