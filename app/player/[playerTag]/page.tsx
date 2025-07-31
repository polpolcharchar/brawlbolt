"use client"

import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import { LinkCopyIndicator } from '@/components/BrawlComponents/Selectors/LinkCopyIndicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { modeLabelMap } from '@/lib/BrawlUtility/BrawlConstants';
import { fetchPlayerOverview } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { CheckCircle, CheckSquare, MinusSquare, XCircle, XSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlayerPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  handleDynamicPlayerTagPath({ playerTagParam: playerTag });

  const { activePlayerTag, playerData } = usePlayerData();

  const router = useRouter();

  const [playerOverview, setPlayerOverview] = useState<any>(undefined);
  useEffect(() => {
    const fetchOverview = async () => {
      const requestResult = await fetchPlayerOverview(activePlayerTag);

      if (requestResult) {
        setPlayerOverview(JSON.parse(requestResult));
      } else {
        console.log("Error");
      }
    }

    if (activePlayerTag) {
      fetchOverview();
    }
  }, [activePlayerTag]);

  return (
    playerData[activePlayerTag] ? (
      <Card className="flex flex-1 flex-col gap-4 p-4 bg-(--background) border-none">

        <div className='flex flex-col items-center'>
          <p className="text-6xl font-bold text-(--foreground)">{playerData[activePlayerTag].name}</p>
          <div className='flex items-center text-(--muted-foreground)'>
            <p className="text-2xl">#{activePlayerTag}</p>
            <LinkCopyIndicator url={'https://www.brawlbolt.com/player/' + activePlayerTag} title={"Copy Profile Link"} />
          </div>
        </div>

        <div className='text-2xl text-(--foreground) font-bold flex flex-col items-center'>

          {/* Display brawler in title case */}
          <p>
            Favorite brawler:{" "}
            {playerOverview?.favoriteBrawlers?.[0]?.brawler
              ? playerOverview.favoriteBrawlers[0].brawler
                .toLowerCase()
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
              : "N/A"}
          </p>
          <p>
            {"Favorite mode: "}
            {playerOverview?.favoriteModes?.[0]?.mode && modeLabelMap[playerOverview.favoriteModes[0].mode as keyof typeof modeLabelMap]}
          </p>

          <p>
            {"Last seen: "}
            {playerOverview?.daysSinceLastSeen !== undefined && (
              playerOverview.daysSinceLastSeen === 0
                ? "Today"
                : playerOverview.daysSinceLastSeen === 1
                  ? "Yesterday"
                  : playerOverview.daysSinceLastSeen + " days ago"
            )}
          </p>

          <div className="flex items-center justify-center gap-1">
            <p>BrawlBolt verified:</p>
            {playerData[activePlayerTag]["verified"] ? (
              <CheckCircle className='text-(--primary)' />
            ) : (
              <div className='flex gap-2 items-center'>
                <XCircle className='text-(--destructive)' />
                <Button className='text-(--foreground)' onClick={() => router.push("/verify")}>
                  Claim Now
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid auto-rows-min gap-4 xl:grid-cols-3 lg:grid-cols-2 place-items-center justify-center text-(--foreground)">

          <div className="bg-(--card) h-full rounded-xl w-fit xl:w-full md:px-4 flex flex-col items-center py-4">
            {playerOverview && (
              <div className='flex flex-col items-center'>
                <p className='text-lg font-bold my-2'>Favorite Brawlers (Regular Modes)</p>
                <Table className="w-fit">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Brawler</TableHead>
                      <TableHead className="px-4">Winrate</TableHead>
                      <TableHead className="px-4">Star Rate</TableHead>
                      <TableHead className="px-4"># Games</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerOverview["favoriteBrawlers"].map((favoriteBrawler: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{favoriteBrawler["brawler"]
                          .toLowerCase()
                          .split(" ")
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}</TableCell>
                        <TableCell>{(favoriteBrawler["winrate"] * 100).toFixed(1)}</TableCell>
                        <TableCell>{(favoriteBrawler["starRate"] * 100).toFixed(1)}</TableCell>
                        <TableCell>{favoriteBrawler["numGames"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  className="mt-2"
                  onClick={() => router.push("/boltGraph")}
                >
                  More Detail
                </Button>
              </div>
            )}
          </div>

          <div className="bg-(--card) h-full rounded-xl w-fit xl:w-full md:px-4 flex flex-col items-center py-4">
            {playerOverview && (
              <div className='flex flex-col items-center'>
                <p className='text-lg font-bold my-2'>Favorite Modes</p>
                <Table className="w-fit">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Mode</TableHead>
                      <TableHead className="px-4">Winrate</TableHead>
                      <TableHead className="px-4">Star Rate</TableHead>
                      <TableHead className="px-4"># Games</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerOverview["favoriteModes"].map((favoriteMode: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{modeLabelMap[favoriteMode["mode"] as keyof typeof modeLabelMap]}</TableCell>
                        <TableCell>{(favoriteMode["winrate"] * 100).toFixed(1)}</TableCell>
                        <TableCell>{favoriteMode["starRate"] ? (favoriteMode["starRate"] * 100).toFixed(1) : "-"}</TableCell>
                        <TableCell>{favoriteMode["numGames"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  className="mt-2"
                  onClick={() => router.push("/boltGraph")}
                >
                  More Detail
                </Button>
              </div>
            )}
          </div>

          <div className="bg-(--card) h-full rounded-xl w-fit xl:w-full md:px-4 flex flex-col items-center py-4">
            {playerOverview && (
              <div className='flex flex-col items-center'>
                <p className='text-lg font-bold my-2'>Recent Games</p>
                <Table className="w-fit">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Result</TableHead>
                      <TableHead className="px-4">Mode</TableHead>
                      <TableHead className="px-4">Type</TableHead>
                      <TableHead className="px-4">Brawlers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerOverview["parsedRecentGames"].map((parsedGame: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {parsedGame["result"] === "victory" ? (
                            <CheckSquare className="text-(--primary)" />
                          ) : parsedGame["result"] === "defeat" ? (
                            <XSquare className="text-(--destructive)" />
                          ) : (
                            <MinusSquare className="text-(--muted-foreground)" />
                          )}
                        </TableCell>
                        <TableCell>
                          {modeLabelMap[parsedGame["mode"] as keyof typeof modeLabelMap]}
                        </TableCell>
                        <TableCell>
                          {parsedGame["type"] === "soloRanked"
                            ? "Ranked"
                            : parsedGame["type"] === "ranked"
                              ? "Regular"
                              : parsedGame["type"]}
                        </TableCell>
                        <TableCell>{parsedGame["brawlers"].join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  className="mt-2"
                  onClick={() => router.push("/matchHistory")}
                >
                  View full Match History
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>


    ) : (
      <div></div>
    )
  );

}