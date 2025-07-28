"use client"

import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { modeLabelMap, modeLabels } from '@/lib/BrawlUtility/BrawlConstants';
import { fetchPlayerOverview } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { Check, CheckCircle, CheckSquare, MinusSquare, X, XCircle, XSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage() {
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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <Card className="bg-muted/50 aspect-video rounded-xl text-center border-none">
            <p className="text-6xl font-bold">{playerData[activePlayerTag].name}</p>
            <p className="text-2xl text-gray-500">#{activePlayerTag}</p>
          </Card>
          <Card className="bg-muted/50 aspect-video rounded-xl text-left border-none pl-2 gap-2 text-2xl text-(--foreground) font-bold">

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

            <p>Last seen:</p>

            <div className="flex items-center gap-1">
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

          </Card>
          {/* <Card className="bg-muted/50 aspect-video rounded-xl text-center border-none">
            Basic match history: last 5 games, win or loss, mode, rank, implement from backend
          </Card> */}
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col items-center">
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
                  className="text-(--foreground) w-full my-2"
                  onClick={() => router.push("/matchHistory")}
                >
                  View full match history
                </Button>
              </div>
            )}
          </div>


          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col items-center">
            {playerOverview && (
              <div className='flex flex-col items-center'>
                <p className='text-lg font-bold my-2'>Favorite Brawlers</p>
                <Table className="w-fit">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Brawler</TableHead>
                      <TableHead className="px-4">Winrate</TableHead>
                      <TableHead className="px-4">Star Rate</TableHead>
                      <TableHead className="px-4">Games Played</TableHead>
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
                  className="text-(--foreground) w-full my-2"
                  onClick={() => router.push("/boltGraph")}
                >
                  More Detail
                </Button>
              </div>
            )}
          </div>

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col items-center">
            {playerOverview && (
              <div className='flex flex-col items-center'>
                <p className='text-lg font-bold my-2'>Favorite Modes</p>
                <Table className="w-fit">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Mode</TableHead>
                      <TableHead className="px-4">Winrate</TableHead>
                      <TableHead className="px-4">Star Rate</TableHead>
                      <TableHead className="px-4">Games Played</TableHead>
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
                  className="text-(--foreground) w-full my-2"
                  onClick={() => router.push("/boltGraph")}
                >
                  More Detail
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

    ) : (
      <div></div>
    )
  );

}