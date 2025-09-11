import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { modeLabels, rankedModeLabels, typeLabelsGlobal } from "@/lib/BrawlUtility/BrawlConstants"
import { fetchGlobalScanInfo, fetchGlobalStats } from "@/lib/BrawlUtility/BrawlDataFetcher"
import { useEffect, useState } from "react"
import { CustomSelector } from "../../Selectors/CustomSelector"
import { MatchTypeSelector } from "../../Selectors/MatchTypeSelector"

export type BrawlerData = {
    name: string
    winrate: number
    drawRate: number
    starRate: number
    numGames: number
}

function getTableDataForChildrenStats(stats: any): BrawlerData[] {

    const tableData = stats.map((brawlerStatObject: any) => {
        const player_result_data = brawlerStatObject['resultCompiler']['player_result_data'];
        const player_star_data = brawlerStatObject['resultCompiler']['player_star_data'];

        const winrate = player_result_data['wins'] / player_result_data['potential_total'];
        const starRate = (player_star_data['wins'] + player_star_data['losses'] + player_star_data['draws']) / player_star_data['potential_total'];

        return {
            name: brawlerStatObject.pathID.substring(brawlerStatObject.pathID.lastIndexOf('$') + 1),
            winrate,
            starRate,
            numGames: player_result_data['potential_total'],
        };
    });

    // Calculate the total numGames
    // const totalNumGames = tableData.reduce((total: any, entry: any) => total + entry.numGames, 0);
    // Append the "Total" row
    // tableData.push({
    //     name: 'Total',
    //     winrate: 0,
    //     drawRate: 0,
    //     starRate: 0,
    //     numGames: totalNumGames,
    // });

    return tableData;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    playerTag: string
    onBrawlerClick: (brawlerName: string) => void
    mode: string
    setMode: (value: string) => void
    matchType: string
    setMatchType: (value: string) => void
}

export function GlobalBrawlerTable<TData, TValue>({
    columns,
    onBrawlerClick,
    mode,
    setMode,
    matchType,
    setMatchType,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: "winrate",
            desc: true,
        },
    ]);

    const [data, setData] = useState<TData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [scanDatetime, setScanDatetime] = useState<string>("");
    const [scanNumGames, setScanNumGames] = useState<number>(-1);
    const [scanHourRange, setScanHourRange] = useState<number>(-1);

    const [scanInfoMessage, setScanInfoMessage] = useState<string>("");
    // Assign scanInfoMessage
    useEffect(() => {
        // If either datetime or hourRange are invalid/empty
        if (!scanDatetime || scanHourRange <= 0) {
            if (scanNumGames === -1) {
                setScanInfoMessage("Calculated using unique games.");
            } else {
                console.log(scanNumGames);
                setScanInfoMessage(`Calculated using ${scanNumGames.toLocaleString()} unique games.`);
            }
            return;
        }

        const endDate = new Date(scanDatetime);
        const startDate = new Date(endDate.getTime() - scanHourRange * 60 * 60 * 1000);

        const formatDate = (d: Date) => {
            const month = d.getMonth() + 1; // Months are 0-indexed
            const day = d.getDate();
            const hour = d.getHours();
            const ampmHour = hour % 12 === 0 ? 12 : hour % 12;
            const ampm = hour >= 12 ? "PM" : "AM";
            return `${month}/${day}, ${ampmHour} ${ampm}`;
        };

        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        if (!scanNumGames || scanNumGames === -1) {
            setScanInfoMessage(`Calculated using unique games from ${startStr} to ${endStr}.`);
        } else {
            setScanInfoMessage(`Calculated using ${scanNumGames.toLocaleString()} unique games from ${startStr} to ${endStr}.`);
        }
    }, [scanDatetime, scanNumGames, scanHourRange]);

    // Load Global Scan Info Data
    useEffect(() => {

        const fetchScanInfo = async () => {
            const scanInfo: any = await fetchGlobalScanInfo();

            if (scanInfo) {
                // const parsedScanInfo = JSON.parse(scanInfo);

                setScanNumGames(scanInfo["numGames"]);
                setScanDatetime(scanInfo["filterID"]);
                setScanHourRange(scanInfo["hourRange"]);
            }
        }

        if (scanInfoMessage == "") {
            setScanInfoMessage("Loading global scan info...");
            fetchScanInfo();
        }
    }, []);

    // Fetch Chart Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData([]);
            const stats = await fetchGlobalStats(1, matchType, mode, "", "brawler");
            setLoading(false);
            if (!stats || stats.length === 0) {
                console.error("No data returned from fetchGlobalStats");
                return;
            }

            setData(getTableDataForChildrenStats(stats[0]['trieData']) as TData[]);
        };

        fetchData();
    }, [mode, matchType]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <Card className="border bg-(--background) m-2 shadow-none min-h-[500px] h-[calc(95svh-var(--header-height))]!">
            <CardHeader className="block justify-between items-start">
                <CardTitle className="text-2xl font-bold mb-0 text-(--foreground)">Brawler Table</CardTitle>

                <div className="text-sm text-(--muted-foreground) mb-4">
                    <p>{scanInfoMessage}</p>
                    <p><u><b>Click rows to access historical data.</b></u></p>
                    <p>Hover values for 95% confidence interval (may not be applicable).</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <MatchTypeSelector
                        matchType={matchType}
                        setMatchType={setMatchType}
                        isGlobal={true}
                    />
                    <CustomSelector
                        value={mode}
                        setValue={setMode}
                        labels={(matchType == "regular" ? modeLabels : rankedModeLabels)}
                        noChoiceLabel="Select Mode..."
                        searchPlaceholder="Search Modes..."
                        emptySearch="No Mode Found"
                        canBeEmpty={true}
                    />
                </div>

            </CardHeader>
            <CardContent className="overflow-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Render 5 skeleton rows as loading placeholders
                            Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-${rowIndex}`}>
                                    {table.getVisibleFlatColumns().map((column, colIndex) => (
                                        <TableCell key={`skeleton-cell-${colIndex}`}>
                                            <Skeleton className="h-4 w-full bg-(--primary-foreground)" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            onClick={() => onBrawlerClick(row.getValue("name"))}
                                            className="text-(--foreground)"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}