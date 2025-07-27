"use client"

import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { CheckCircle, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  handleDynamicPlayerTagPath({ playerTagParam: playerTag });

  const { activePlayerTag, playerData } = usePlayerData();

  const router = useRouter()

  return (
    playerData[activePlayerTag] ? (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card className="bg-muted/50 aspect-video rounded-xl text-center border-none">
            <p className="text-6xl font-bold">{playerData[activePlayerTag].name}</p>
            <p className="text-2xl text-gray-500">#{activePlayerTag}</p>
          </Card>
          <Card className="bg-muted/50 aspect-video rounded-xl text-left border-none pl-2 gap-2 text-2xl text-(--foreground) font-bold">
            <p>Favorite brawler:</p>
            <p>Favorite mode:</p>
            <p>Last seen:</p>

            <div className="flex items-center gap-1">
              <p>BrawlBolt verified:</p>
              {playerData[activePlayerTag]["verified"] ? (
                <CheckCircle className='text-(--primary)' />

              ) : (
                <div className='flex gap-2 items-center'>
                <XCircle className='text-(--destructive)'/>
                <Button className='text-(--foreground)' onClick={() => router.push("/verify")}>
                  Claim Now
                </Button>
                </div>
            )}
            </div>

          </Card>
          <Card className="bg-muted/50 aspect-video rounded-xl text-center border-none">
            Basic match history: last 5 games, win or loss, mode, rank, implement from backend
          </Card>
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    ) : (
      <div></div>
    )
  );

}