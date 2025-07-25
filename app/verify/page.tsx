"use client"

import { VerificationCard } from "@/components/BrawlComponents/InfoCards/VerificationCard";
import { PlayerSelector } from "@/components/BrawlComponents/Selectors/PlayerSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {

  const router = useRouter()

  const { activePlayerTag } = usePlayerData();

  const handleRedirect = async (basePath: string) => {
    router.push(`/${basePath}/${activePlayerTag.replace("#", "")}`)
  }

  useEffect(() => {
    if(activePlayerTag){
    router.push(`/player/${activePlayerTag.replace("#", "")}`)
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Verify Your Brawl Stars Account</h1>
        <p className="text-lg text-gray-600">
          Get access to all of BrawlBolt's features
        </p>
      </div>

      <VerificationCard/>
    </div>
  );
}