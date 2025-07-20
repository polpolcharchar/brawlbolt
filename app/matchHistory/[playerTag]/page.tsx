"use client"

import { MatchTable } from '@/components/BrawlComponents/Tables/MatchTable/MatchTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fetchMatches } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { CalendarSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;


  const [popoverOpen, setPopoverOpen] = useState(false);

  const [matchesJSON, setMatchesJSON] = useState<any[]>([]);

  const [forwardDisabled, setForwardDisabled] = useState(false);
  const [backwardDisabled, setBackwardDisabled] = useState(false);


  function formatDateForBrawlStars(date: Date): string {
    const iso = date.toISOString();
    return iso.replace(/[-:]/g, '').replace('.000Z', '.000Z');
  }

  const jumpToGameDate = async (datetime: string) => {
    if (!playerTag) return;

    const formattedDate = datetime
      .replace(/-/g, '')
      .replace(/:/g, '')
      .replace(/\./g, '')
      .replace('T', 'T')
      .replace('Z', '.000Z');

    const requestResult = await fetchMatches(
      playerTag.toString(),
      formattedDate,
      5,
      5
    );
    if (!requestResult) return;

    const parsed = JSON.parse(requestResult);
    setMatchesJSON(parsed);
    setForwardDisabled(false);
    setBackwardDisabled(false);
  }

  const changeGamesPage = async (goForward: boolean) => {
    if (!playerTag || !matchesJSON || matchesJSON.length === 0) return;

    const lastIndex = goForward ? matchesJSON.length - 1 : 0;
    const pivotDatetime = matchesJSON[lastIndex].battleTime;

    const requestResult = await fetchMatches(
      playerTag.toString(),
      pivotDatetime,
      goForward ? 0 : 10, // numBefore
      goForward ? 10 : 0  // numAfter
    );

    if (!requestResult) return;

    const parsed = JSON.parse(requestResult);

    if (parsed.length == 0) {
      if (goForward) {
        setForwardDisabled(true);
      } else {
        setBackwardDisabled(true);
      }
      return;
    }

    setMatchesJSON(parsed);
    setForwardDisabled(false);
    setBackwardDisabled(false);
  };

  return (
    <Card className='border-none rounded-none'>
      <CardHeader className="flex flex-col items-center">
        <u className="text-2xl font-bold mb-2">Games Table</u>
        <div className="flex items-center">
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

      </CardHeader>

      <CardContent>
        {playerTag && (
          <MatchTable matchesJSON={matchesJSON} playerTag={playerTag?.toString()} />
        )}
      </CardContent>
    </Card>
  )
}