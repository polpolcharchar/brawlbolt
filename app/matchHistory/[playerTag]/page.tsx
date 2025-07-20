"use client"

import { MatchCard } from '@/components/BrawlComponents/MainCards/MatchCard';
import { MatchTable } from '@/components/BrawlComponents/Tables/MatchTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fetchMatches } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;


  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);


  const [matchesJSON, setMatchesJSON] = useState<any[]>([]);
  useEffect(() => {

    if (!playerTag) return;

    const fetchData = async () => {
      const formattedDate = selectedDate
        .toISOString()
        .replace(/-/g, '')
        .replace(/:/g, '')
        .replace(/\./g, '')
        .replace('T', 'T')
        .replace('Z', '.000Z');
      const requestResult = await fetchMatches(playerTag.toString(), formattedDate, 5, 5);

      if (requestResult) {
        const parsed = JSON.parse(requestResult);

        setMatchesJSON(parsed);
      }
    }

    fetchData();
  }, [selectedDate]);

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

    if (requestResult) {
      const parsed = JSON.parse(requestResult);

      setMatchesJSON(parsed);
    }
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
            // onClick={() => setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000))}
            onClick={() => changeGamesPage(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="px-4" onClick={() => setPopoverOpen(true)}>
                  {selectedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: any) => {
                    if (date) setSelectedDate(date);
                    setPopoverOpen(false);
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="mx-2"
            // onClick={() => setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000))}
            onClick={() => changeGamesPage(true)}
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