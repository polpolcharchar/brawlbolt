import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMode, modeLabelMap } from "@/lib/BrawlUtility/BrawlConstants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";


export const MatchTable = ({ matchesJSON, playerTag }: { matchesJSON: any[], playerTag: string }) => {

    function formatDate(dateStr: string): string {
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


    // const [playerData, setPlayerData] = useState(() => PlayerManager.getCurrentPlayerData());

    // useEffect(() => {
    //     const updateData = () => setPlayerData(PlayerManager.getCurrentPlayerData());
    //     PlayerManager.onPlayerDataChanged(updateData);

    //     return () => {
    //         PlayerManager.offPlayerDataChanged(updateData);
    //     };
    // }, []);

    const [mode, setMode] = useState("");

    // const specificGames = playerData.battles.filter((game) => {
    //     if (mode === "") return true;

    //     return game.getMode() === mode;
    // });


    const pageSizeOptions = [20, 50, 100];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const totalPages = Math.ceil(matchesJSON.length / pageSize);

    const handlePageSizeChange = (value: string) => {
        const newPageSize = parseInt(value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to the first page when page size changes
    };




    // const paginatedGames = specificGames
    //     .sort((gameA, gameB) => parseISO(gameB.battleTime).getTime() - parseISO(gameA.battleTime).getTime())
    //     .slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const [currentBattle, setCurrentBattle] = useState<any | null>(null);


    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [popoverOpen, setPopoverOpen] = useState(false);

    return (
        <Card className="p-2 rounded-none border-none">



            {/* <BattleInfoDialog battleData={currentBattle} setCurrentBattle={setCurrentBattle}></BattleInfoDialog> */}


            {/* Pagination and mode */}
            {/* {(
                <div className="rounded-lg border bg-card mt-4">
                    <div className="p-4 flex items-center justify-between">

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            <ModeSelector mode={mode} setMode={setMode} />


                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <Select
                                value={pageSize.toString()}
                                onValueChange={handlePageSizeChange}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )} */}
            {/* Actual Table */}
            <Table className="w-full table-fixed">
                {/* <TableCaption>{playerData.playerName}</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Map</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Average Trophies</TableHead>
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
                            <TableCell>{"Average Trophies"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}