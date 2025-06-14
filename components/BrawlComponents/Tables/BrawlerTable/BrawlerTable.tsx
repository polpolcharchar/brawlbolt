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

import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RecursiveCompiledStats, usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider"
import { useMemo } from "react"
import { ModeSelector } from "../../Selectors/ModeSelector"
import { RegularRankedToggle } from "../../Selectors/RegularRankedToggle"

export type BrawlerData = {
    name: string
    winrate: number
    drawRate: number
    starRate: number
    numGames: number
}

function getTableDataForChildrenStats(stats: RecursiveCompiledStats): BrawlerData[] {
    if (!stats || !stats['stat_map']) {
        return [];
    }

    const tableData = Object.entries(stats['stat_map']).map(([modeName, modeStats]) => ({
        name: modeName, // Mapping modeName to name
        winrate: modeStats.overallResults.playerResultData.getWinrate(),
        drawRate: modeStats.overallResults.playerResultData.getDrawRate(),
        starRate: modeStats.overallResults.playerStarData.getStarRate(),
        numGames: modeStats.overallResults.playerResultData.potentialTotal,
    }));

    // Calculate the total numGames
    const totalNumGames = tableData.reduce((total, entry) => total + entry.numGames, 0);

    // Append the "Total" row
    tableData.push({
        name: 'Total',
        winrate: 0,
        drawRate: 0,
        starRate: 0,
        numGames: totalNumGames,
    });

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

export function BrawlerDataTable<TData, TValue>({
    columns,
    playerTag,
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
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }

    const {
        playerData
    } = usePlayerData();

    const data = useMemo(() => {
        if (!playerTag) return [];

        const stats = playerData[playerTag]?.playerStats;
        if (!stats) return [];

        const isRegular = rankedVsRegularToggleValue === "regular";
        const mapKey = isRegular
            ? (mode === "" ? (playerTag === "Global" ? "regularBrawler" : "regularBrawlerModeMap") : `regularModeBrawler.stat_map.${mode}`)
            : (mode === "" ? (playerTag === "Global" ? "rankedBrawler" : "rankedBrawlerModeMap") : `rankedModeBrawler.stat_map.${mode}`);

        const mapData = mapKey.split('.').reduce((acc, key) => acc?.[key], stats);

        return getTableDataForChildrenStats(mapData) as TData[];
    }, [playerTag, mode, rankedVsRegularToggleValue, playerData]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        }
    })

    return (
        <div>
            <Card className="border-none p-0">
                <CardHeader className="block justify-between items-start">
                    <CardTitle className="text-2xl font-bold mb-0">Brawler Table</CardTitle>

                    <div className="text-sm text-gray-300 mb-4">

                        {playerData[playerTag]["numGames"] && (
                            <>
                                <p>
                                    Calculated using{" "}
                                    {playerData[playerTag]["numGames"]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                    unique games from{" "}
                                    {new Date(
                                        new Date(playerData[playerTag]["datetime"]).getTime() -
                                        playerData[playerTag]["hourRange"] * 60 * 60 * 1000
                                    ).toLocaleString("en-US", dateFormat)}{" "}
                                    to {new Date(playerData[playerTag]["datetime"]).toLocaleString("en-US", dateFormat)}
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

                        <ModeSelector mode={mode} setMode={setMode} />
                    </div>

                </CardHeader>
                <CardContent>
                    <div className="h-[500px] overflow-auto border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={playerTag === "Global" ? "cursor-pointer" : ""}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} onClick={() => onBrawlerClick(row.getValue("name"))}>
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
