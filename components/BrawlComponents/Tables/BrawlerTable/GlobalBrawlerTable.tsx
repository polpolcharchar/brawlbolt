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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { modeLabels, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants"
import { fetchGlobalStats } from "@/lib/BrawlUtility/BrawlDataFetcher"
import { useEffect, useState } from "react"
import { CustomSelector } from "../../Selectors/CustomSelector"
import { RegularRankedToggle } from "../../Selectors/RegularRankedToggle"
import { Skeleton } from "@/components/ui/skeleton"

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
    const totalNumGames = tableData.reduce((total: any, entry: any) => total + entry.numGames, 0);

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
    rankedVsRegularToggleValue: string
    setRankedVsRegularToggleValue: (value: string) => void
}

export function GlobalBrawlerTable<TData, TValue>({
    columns,
    onBrawlerClick,
    mode,
    setMode,
    rankedVsRegularToggleValue,
    setRankedVsRegularToggleValue,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: "winrate",
            desc: true,
        },
    ]);

    const dateFormat: any = {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        hour12: true
    }

    const [gameCollectionDatetime, setGameCollectionDatetime] = useState("");

    const [data, setData] = useState<TData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData([]);
            const stats = await fetchGlobalStats(1, rankedVsRegularToggleValue, mode, "", "brawler");
            setLoading(false);
            if (!stats || stats.length === 0) {
                console.error("No data returned from fetchGlobalStats");
                return;
            }

            const parsedStats = JSON.parse(stats);

            setGameCollectionDatetime(parsedStats[0]["datetime"]);

            setData(getTableDataForChildrenStats(parsedStats[0]['trieData']) as TData[]);
        };

        fetchData();
    }, [mode, rankedVsRegularToggleValue]);

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
        <div>
            <Card className="border-none p-0">
                <CardHeader className="block justify-between items-start">
                    <CardTitle className="text-2xl font-bold mb-0">Brawler Table</CardTitle>

                    <div className="text-sm text-gray-300 mb-4">

                        {gameCollectionDatetime != "" && (
                            <>
                                <p>
                                    Calculated using{" "}
                                    {/* {playerData[playerTag]["numGames"]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                                    unique games from{" "}
                                    {new Date(
                                        new Date(gameCollectionDatetime).getTime() -
                                        24 * 60 * 60 * 1000
                                    ).toLocaleString("en-US", dateFormat)}{" "}
                                    to {new Date(gameCollectionDatetime).toLocaleString("en-US", dateFormat)}
                                </p>
                                <p><u><b>Click rows to access historical data</b></u></p>
                            </>
                        )}

                        <p>Hover values for 95% confidence interval (may not be applicable)</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <RegularRankedToggle
                            rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                            setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
                            statType=""
                        />
                        <CustomSelector
                            value={mode}
                            setValue={setMode}
                            labels={(rankedVsRegularToggleValue == "regular" ? modeLabels : rankedModeLabels)}
                            noChoiceLabel="Select Mode..."
                            searchPlaceholder="Search Modes..."
                            emptySearch="No Mode Found"
                            canBeEmpty={true}
                        />
                    </div>

                </CardHeader>
                <CardContent>
                    <div className="h-[50vh] overflow-auto border">
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
                                                    <Skeleton className="h-4 w-full" />
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

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
