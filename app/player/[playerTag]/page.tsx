"use client"

import { PlayerSelector } from '@/components/BrawlComponents/Selectors/PlayerSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidTag } from '@/lib/BrawlUtility/BrawlConstants';
import { handlePlayerSearch } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  const { updatePlayerData, setActivePlayerTag, playerData, setIsLoadingPlayer } = usePlayerData();
  useEffect(() => {
    const playerTagString = playerTag?.toString();
    if (!playerTagString || !isValidTag(playerTagString) || playerTagString in playerData) return;

    const normalizedTag = (playerTagString.startsWith("#") ? playerTagString.substring(1) : playerTagString).toUpperCase();
    const fetchData = async () => {
      const success = await handlePlayerSearch(normalizedTag.toUpperCase(), setIsLoadingPlayer, updatePlayerData);

      if (success) {
        setActivePlayerTag(normalizedTag);
      }

    }
    fetchData();
  }, []);

  const router = useRouter()

  const handleRedirect = async (basePath: string) => {
    router.push(`/${basePath}/${playerTag?.toString().replace("#", "")}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">BrawlBolt Account Page</h1>
        <p className="text-lg text-gray-600">
          {playerTag}
        </p>
      </div>
      <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CardDescription>Favorite mode, brawler, and more!</CardDescription>
            <Button className='text-white'
              onClick={() => {
                handleRedirect("boltGraph");
              }}
            >
              Go to BoltGraph
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-[0.5rem] text-gray-500">{"Account Verification?"}</p>

          </CardFooter>
        </Card>
      </div>
    </div>

  );
}