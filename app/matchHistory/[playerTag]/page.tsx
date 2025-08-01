"use client"

import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import ScarceDataAlertCard from '@/components/BrawlComponents/InfoCards/ScarceDataAlertCard';
import { PlayerSelector } from '@/components/BrawlComponents/Selectors/PlayerSelector';
import { MatchTable } from '@/components/BrawlComponents/Tables/MatchTable/MatchTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fetchMatches } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { CalendarSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function MatchHistoryPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  handleDynamicPlayerTagPath({
    playerTagParam: playerTag,
  });

  const { activePlayerTag, playerData } = usePlayerData();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const [matchesJSON, setMatchesJSON] = useState<any[]>([]);
  const hasLoadedInitialGames = useRef(false);

  const [forwardDisabled, setForwardDisabled] = useState(false);
  const [backwardDisabled, setBackwardDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  function formatDateForBrawlStars(date: Date): string {
    const iso = date.toISOString();
    return iso.replace(/[-:]/g, '').replace('.000Z', '.000Z');
  }

  const jumpToGameDate = async (datetime: string, firstRequest = false, provideTag = "") => {

    const tagToUse = provideTag != "" ? provideTag : activePlayerTag;

    if (!tagToUse || isLoading) return;

    const formattedDate = datetime
      .replace(/-/g, '')
      .replace(/:/g, '')
      .replace(/\./g, '')
      .replace('T', 'T')
      .replace('Z', '.000Z');

    const requestResult = await fetchMatches(
      tagToUse.toString(),
      formattedDate,
      firstRequest ? 10 : 5,
      firstRequest ? 0 : 5,
      setIsLoading,
      playerData[activePlayerTag]["token"]
    );
    if (!requestResult) return;

    setMatchesJSON(requestResult);
    setForwardDisabled(false);
    setBackwardDisabled(false);
  }

  const changeGamesPage = async (goForward: boolean) => {
    if (!activePlayerTag || !matchesJSON || matchesJSON.length === 0 || isLoading) return;

    const lastIndex = goForward ? matchesJSON.length - 1 : 0;
    const pivotDatetime = matchesJSON[lastIndex].battleTime;

    const requestResult = await fetchMatches(
      activePlayerTag.toString(),
      pivotDatetime,
      goForward ? 0 : 10, // numBefore
      goForward ? 10 : 0,  // numAfter
      setIsLoading,
      playerData[activePlayerTag]["token"]
    );

    if (!requestResult) return;

    if (requestResult.length == 0) {
      if (goForward) {
        setForwardDisabled(true);
      } else {
        setBackwardDisabled(true);
      }
      return;
    }

    setMatchesJSON(requestResult);
    setForwardDisabled(false);
    setBackwardDisabled(false);
  };

  useEffect(() => {
    if(!hasLoadedInitialGames.current && !isLoading && activePlayerTag && playerData[activePlayerTag] && playerData[activePlayerTag]["token"]){
      jumpToGameDate(new Date().toISOString(), true);
      hasLoadedInitialGames.current = true;
    }
  }, [playerData[activePlayerTag]]);

  return (
    <div>
      <Card className='border m-2 bg-(--background)'>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-bold mb-0 text-(--foreground)">Match History</CardTitle>
          <CardDescription className='mb-2 text-(--muted-foreground)'>{activePlayerTag}</CardDescription>
        </CardHeader>

        <CardContent>
          {playerTag && playerData[playerTag.toString()] && playerData[playerTag.toString()]["token"] ? (
            <div>
              <div className="flex items-center text-(--foreground)">
                <Button
                  variant="outline"
                  size="icon"
                  className="mx-2"
                  onClick={() => changeGamesPage(false)}
                  disabled={backwardDisabled}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center">
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="px-4" onClick={() => setPopoverOpen(true)}>
                        <CalendarSearch />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          if (date) {
                            const formatted = formatDateForBrawlStars(date)
                            jumpToGameDate(formatted)
                          }
                          setPopoverOpen(false);
                        }}
                        autoFocus
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="mx-2"
                  onClick={() => changeGamesPage(true)}
                  disabled={forwardDisabled}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <MatchTable matchesJSON={matchesJSON} playerTag={playerTag.toString()} />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center text-center text-lg text-(--foreground)'>
              {playerTag && playerData[playerTag.toString()] && (
                playerData[playerTag.toString()]["verified"] ? (
                  <div>
                    <div className="flex gap-2 items-center justify-center max-w-xl mb-2">
                      <PlayerSelector />{` is not logged in!`}
                    </div>
                    <p>{`Enter ${playerTag}'s BrawlBolt password using the player selector.`}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 items-center justify-center text-lg max-w-xl mb-2">
                      <PlayerSelector />{` is not BrawlBolt verified.`}
                    </div>
                    <p className='text-lg'>{`Verify ${playerTag} using the player selector.`}</p>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='mt-4'>
        <ScarceDataAlertCard />
      </div>
    </div>

  )
}