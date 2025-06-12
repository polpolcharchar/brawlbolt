import { boltColors, brawlerLabels, modeLabelMap } from "@/lib/BrawlUtility/BrawlConstants";
import { RecursiveCompiledStats, usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChartTooltip } from "../../ui/chart";
import { BrawlerSelector } from "../Selectors/BrawlerSelector";
import { ModeSelector } from "../Selectors/ModeSelector";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";
import { StatTypeSelector } from "../Selectors/StatTypeSelector";

function getChartDataForChildrenStats(stats: RecursiveCompiledStats) {
    if (!stats) {
        return [];
    }

    return Object.entries(stats['stat_map']).map(([modeName, modeStats]) => {
        return {
            value: modeName,
            winrate: modeStats.overallResults.playerResultData.getWinrate(),
            starRate: modeStats.overallResults.playerStarData.getStarRate(),
            numGames: modeStats.overallResults.playerResultData.potentialTotal,
            trophyChange: modeStats.overallResults.playerTrophyChange,
            trophyChangePerGame: modeStats.overallResults.playerTrophyChange / modeStats.overallResults.playerResultData.potentialTotal
        }
    });
}

const CustomPlayerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { value, payload: data } = payload[0];
        const modeName: string = data.value;
        return (
            <div className="bg-black p-2 border rounded-lg shadow text-sm text-white">
                <p>{modeLabelMap[modeName as keyof typeof modeLabelMap] ?? data.value}</p>
                <p>Winrate: {(data.winrate * 100).toFixed(1)}%</p>
                <p>Star Rate: {(data.starRate * 100).toFixed(1)}%</p>
                <p>Trophy Change: {data.trophyChange}</p>
                <p>Trophy Change / Game: {data.trophyChangePerGame.toFixed(2)}</p>
                <p>Games: {data.numGames}</p>
            </div>
        );
    }
    return null;
};


export const RecursiveStatisticChart = ({ playerTag }: { playerTag: string }) => {

    const {
        playerData
    } = usePlayerData();

    //Sort brawlers based off player usage
    const sortedBrawlers = !playerTag ? [] : brawlerLabels.slice().sort((a, b) => {
        // let brawlerA = playerData[playerTag].playerStats.regularBrawlerModeMap['stat_map'][a.value];
        // let brawlerB = playerData[playerTag].playerStats.regularBrawlerModeMap['stat_map'][b.value];

        let brawlerA = playerData[playerTag].playerStats.regularBrawlerModeMap.stat_map[a.value];
        let brawlerB = playerData[playerTag].playerStats.regularBrawlerModeMap.stat_map[b.value];

        // Handle cases where there is no entry in the stat map
        if (!brawlerA && !brawlerB) return a.value < b.value ? 1 : 0; // Both have no entry, they are equal
        if (!brawlerA) return 1; // `a` has no entry, it should come after `b`
        if (!brawlerB) return -1; // `b` has no entry, it should come after `a`

        // Both have entries, sort by total in descending order
        const playerDiff = brawlerB.overallResults.playerResultData.potentialTotal - brawlerA.overallResults.playerResultData.potentialTotal;
        // if (playerDiff === 0) {
        //     return brawlerB.overall.overall_result_data.potential_total - brawlerA.overall.overall_result_data.potential_total;
        // }
        return playerDiff;
    });

    const [brawler, setBrawler] = useState("");

    const [mode, setMode] = useState("");
    const [statType, setStatType] = useState("winrate");
    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("regular");

    const smallTickFont = {
        fontSize: 6
    }

    //Ensures that ranked is not selected when trophy-related statistics are also selected
    const setStatTypeAndUpdateOverallToggle = (value: string): void => {
        if (rankedVsRegularToggleValue === "ranked" && (value === "trophyChange" || value === "trophyChangePerGame")) {
            setRankedVsRegularToggleValue("regular");
        }
        setStatType(value);
    }

    //Get Chart Data:
    const chartData = !playerTag ? [] : getChartDataForChildrenStats(
        (rankedVsRegularToggleValue === "regular") ? (
            (brawler === "" && mode === "") ?
                playerData[playerTag].playerStats.regularModeMapBrawler
                :
                (brawler === "") ?
                    playerData[playerTag].playerStats.regularModeMapBrawler.stat_map[mode]
                    :
                    (mode === "") ?
                        playerData[playerTag].playerStats.regularBrawlerModeMap.stat_map[brawler]
                        :
                        playerData[playerTag].playerStats.regularBrawlerModeMap.stat_map[brawler].stat_map[mode])
            : (
                (brawler === "" && mode === "") ?
                    playerData[playerTag].playerStats.rankedModeMapBrawler
                    :
                    (brawler === "") ?
                        playerData[playerTag].playerStats.rankedModeMapBrawler.stat_map[mode]
                        :
                        (mode === "") ?
                            playerData[playerTag].playerStats.rankedBrawlerModeMap.stat_map[brawler]
                            :
                            playerData[playerTag].playerStats.rankedBrawlerModeMap.stat_map[brawler].stat_map[mode])
    );
    chartData.sort((a, b) => {
        return b.numGames - a.numGames;
    });

    return (
        <div>
            <Card className="border-none">
                <CardHeader className="block justify-between items-start">
                    <CardTitle className="text-2xl font-bold mb-4">Recursive Stat Chart</CardTitle>

                    <div className="flex flex-wrap gap-4">
                        {/* regular vs ranked */}
                        <RegularRankedToggle
                            rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                            setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
                            statType={statType}
                        />

                        <StatTypeSelector statType={statType} setStatType={setStatTypeAndUpdateOverallToggle} />

                        <ModeSelector mode={mode} setMode={setMode} />

                        {/* brawler popovercenter */}
                        {/* <Popover open={brawlerPopoverOpen} onOpenChange={setBrawlerPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={brawlerPopoverOpen}
                                    className="max-w-[200px] w-full justify-between"
                                >
                                    {brawler
                                        ? sortedBrawlers.find((brawlerChoice) => brawlerChoice.value === brawler)?.label
                                        : "Select brawler..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
                                <Command>
                                    <CommandInput placeholder="Search brawlers..." />
                                    <CommandList>
                                        <CommandEmpty>No brawler found</CommandEmpty>
                                        <CommandGroup>
                                            {sortedBrawlers.map((brawlerChoice) => (
                                                <CommandItem
                                                    key={brawlerChoice.value}
                                                    value={brawlerChoice.value}
                                                    onSelect={(currentValue: string) => {
                                                        setBrawler(currentValue === brawler ? "" : currentValue)
                                                        setBrawlerPopoverOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={clsx(
                                                            "mr-2 h-4 w-4",
                                                            brawler === brawlerChoice.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {brawlerChoice.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover> */}
                        <BrawlerSelector brawler={brawler} setBrawler={setBrawler} selectBrawlerLabels={sortedBrawlers}/>
                    </div>
                </CardHeader>

                <CardContent className="h-[60vh]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ bottom: 80 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeWidth={0.1}
                            />

                            <XAxis
                                dataKey="value"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                tickFormatter={(tick: string) => {
                                    if (mode === "") {
                                        return modeLabelMap[tick as keyof typeof modeLabelMap] ?? tick;
                                    }
                                    return tick;
                                }}
                                tick={window.innerWidth < 400 ? smallTickFont : {}}
                            />

                            <YAxis
                                type="number"
                                tickFormatter={(tick) => Math.abs(tick) > 1 || tick === 0 ? tick : tick.toFixed(2)} // Formats labels (e.g., "0.50")
                            />

                            <ChartTooltip
                                cursor={false}
                                content={<CustomPlayerTooltip />}
                            />

                            <Bar
                                dataKey={statType}
                                radius={[8, 8, 0, 0]}
                                fill={boltColors.blue700}
                            />

                            <ReferenceLine
                                y={Math.max(...chartData.map(item => {

                                    const x = item[statType as keyof typeof item];

                                    if (x) {
                                        return Number(x);
                                    }
                                    return 0;
                                })) * 0.7}
                                label="brawlbolt.com"
                                strokeWidth={0}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div >
    );
}