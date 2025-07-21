import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMode, modeLabelMap } from "@/lib/BrawlUtility/BrawlConstants";
import { useState } from "react";
import { getAverageTrophies, MatchInfoDialog } from "./MatchInfoDialog";

export function formatDate(dateStr: string): string {

    if(!dateStr){
        return "undefined";
    }

    // Format is "YYYYMMDDTHHMMSS.000Z"
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1; // JS months are 0-based
    const day = parseInt(dateStr.slice(6, 8));
    const hour = parseInt(dateStr.slice(9, 11));
    const minute = parseInt(dateStr.slice(11, 13));

    const date = new Date(Date.UTC(year, month, day, hour, minute));

    const localMonth = date.getMonth() + 1;
    const localDay = date.getDate();
    let localHour = date.getHours();
    const localMinute = date.getMinutes();
    const ampm = localHour >= 12 ? "PM" : "AM";

    localHour = localHour % 12 || 12;
    const paddedMinute = localMinute.toString().padStart(2, "0");

    return `${localMonth}/${localDay}, ${localHour}:${paddedMinute} ${ampm}`;
}

export const MatchTable = ({ matchesJSON, playerTag }: { matchesJSON: any[], playerTag: string }) => {
    const [currentBattle, setCurrentBattle] = useState<any | null>(null);

    return (
        <Card className="p-2 rounded-none border-none shadow-none bg-(--background)">
            <MatchInfoDialog battleData={currentBattle} setCurrentBattle={setCurrentBattle}></MatchInfoDialog>

            <Table className="w-full">
                <TableCaption>{playerTag}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[100px]">Mode</TableHead>
                        <TableHead className="min-w-[100px]">Map</TableHead>
                        <TableHead className="min-w-[100px]">Result</TableHead>
                        <TableHead className="min-w-[100px]">Average Trophies</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {matchesJSON.map((match) => (
                        <TableRow key={match.battleTime} onClick={() => setCurrentBattle(match)}>
                            <TableCell>{formatDate(match.battleTime)}</TableCell>
                            <TableCell>
                                {modeLabelMap[getMode(match) as keyof typeof modeLabelMap] ?? getMode(match)}
                            </TableCell>
                            <TableCell>{match.event.map}</TableCell>
                            <TableCell>{match.battle.trophyChange}</TableCell>
                            <TableCell>{Math.round(getAverageTrophies(match.battle))}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}