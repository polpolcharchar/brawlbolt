"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { brawlerLabels, modeLabelMap, modeLabels, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { fetchGlobalStats, fetchTrieData } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { LockIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CustomSelector } from "../Selectors/CustomSelector";

const CustomPlayerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { value, payload: data } = payload[0];
        const modeName: string = data.value;
        return (
            <div className="bg-black p-2 border rounded-lg shadow text-sm text-white">
                <p>{modeLabelMap[modeName as keyof typeof modeLabelMap] ??
                    data.value
                        .toLowerCase()
                        .split(' ')
                        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                }</p>
                <p>Winrate: {(data.winrate * 100).toFixed(1)}%</p>
                <p>Star Rate: {(data.starRate * 100).toFixed(1)}%</p>
                <p>Trophy Change: {data.trophyChange}</p>
                <p>Trophy Change / Game: {data.trophyChangePerGame.toFixed(2)}</p>
                <p>Average Duration: {data.averageDuration.toFixed(0)} seconds</p>
                <p>Games: {data.numGames}</p>
            </div>
        );
    }
    return null;
};

export const TrieExplorerChart = ({ playerTag, isGlobal }: { playerTag: string, isGlobal: boolean }) => {

    const { playerData } = usePlayerData();

    const [brawler, setBrawler] = useState("");
    const [mode, setMode] = useState("");
    const setModeAndUpdateMap = (value: string): void => {
        //If mode changes, map should always be reset
        setMode(value);
        setMap("");
    }
    const [map, setMap] = useState("");

    const [targetAttribute, setTargetAttribute] = useState("brawler");
    const setTargetAttributeAndUpdateOtherAttributes = (value: string): void => {
        setTargetAttribute(value);
        if (value == "map" && mode === "") {
            setModeAndUpdateMap("brawlBall");
        }

        if (value != "type" && rankedVsRegularToggleValue == "") {
            updateRegularVsRankedToggleValueAndDependents("regular");
        }

        if (value == "map") {
            setMap("");
        } else if (value == "brawler") {
            setBrawler("");
        } else if (value == "mode") {
            setMode("");
            setMap("");
        } else if (value == "type") {
            updateRegularVsRankedToggleValueAndDependents("");
        }

        // Update stat type and sorting:
        if (value == "type" && (statType == "trophyChange" || statType == "trophyChangePerGame")) {
            setStatTypeAndUpdateDependents("winrateMinusStarRate");
        }
        if (value == "type" && (sortingStatType == "trophyChange" || sortingStatType == "trophyChangePerGame")) {
            setSortingStatType("winrate");
        }
    }
    const [targetAttributeLabels] = useState<{ value: string; label: string }[]>(
        [
            { value: "mode", label: "Mode" },
            { value: "brawler", label: "Brawler" },
            !isGlobal ? { value: "map", label: "Map" } : null,
            { value: "type", label: "Type" },
        ].filter(Boolean) as { value: string; label: string }[]//Filter out the null value if isGlobal
    );

    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState(isGlobal ? "ranked" : "regular");
    const updateRegularVsRankedToggleValueAndDependents = (value: string) => {
        setRankedVsRegularToggleValue(value);

        if (value == "ranked" && (statType == "trophyChange" || statType == "trophyChangePerGame")) {
            setStatTypeAndUpdateDependents("winrateMinusStarRate");
        }

        if (value == "ranked" && (sortingStatType == "trophyChange" || sortingStatType == "trophyChangePerGame")) {
            setSortingStatType("winrate");
        }
    }
    const [rankedVsRegularToggleLabels] = useState<{ value: string; label: string }[]>([
        { value: "regular", label: "Regular" },
        { value: "ranked", label: "Ranked" }
    ]);

    const [statType, _setStatType] = useState("winrateMinusStarRate");
    const setStatTypeAndUpdateDependents = (value: string): void => {
        if (sortByStatType) {
            if (value === "winrateMinusStarRate") {
                setSortingStatType("winrate");
            } else {
                setSortingStatType(value);
            }
        }

        _setStatType(value);
    }
    const statTypeLabels = useMemo(() => {
        return [
            { value: "winrateMinusStarRate", label: "Winrate" },
            rankedVsRegularToggleValue === "regular" && targetAttribute != "type" ? { value: "trophyChange", label: "Trophy Change" } : null,
            rankedVsRegularToggleValue === "regular" && targetAttribute != "type" ? { value: "trophyChangePerGame", label: "Trophy Change / Game" } : null,
            { value: "averageDuration", label: "Average Duration" },
            { value: "numGames", label: "Games Played" },
        ].filter(Boolean) as { value: string; label: string }[]
    }, [rankedVsRegularToggleValue]);

    const [mapLabels, setMapLabels] = useState<{ value: string; label: string }[]>([]);

    const [sortingStatType, setSortingStatType] = useState(isGlobal ? "winrate" : "numGames");
    const [sortByStatType, setSortByStatType] = useState(isGlobal ? true : false);
    const sortingTypeLabels = useMemo(() => {
        return [
            { value: "winrate", label: "Winrate" },
            { value: "starRate", label: "Star Rate" },
            rankedVsRegularToggleValue == "regular" && targetAttribute != "type" ? { value: "trophyChange", label: "Trophy Change" } : null,
            rankedVsRegularToggleValue == "regular" && targetAttribute != "type" ? { value: "trophyChangePerGame", label: "Trophy Change / Game" } : null,
            { value: "averageDuration", label: "Average Duration" },
            { value: "numGames", label: "Games Played" },
        ].filter(Boolean) as { value: string; label: string }[]
    }, [rankedVsRegularToggleValue]);

    const [chartData, setChartData] = useState<
        { value: string; winrate: number }[]
    >([]);
    const sortChartData = () => {
        setChartData((prevData) => {
            return [...prevData].sort((a: any, b: any) => {
                return b[sortingStatType] - a[sortingStatType];
            });
        });
    }
    const fetchAndSetChartData = async () => {

        let rawData: any;

        if (isGlobal) {
            rawData = await fetchGlobalStats(1, rankedVsRegularToggleValue, mode, brawler, targetAttribute);
        } else {
            rawData = await fetchTrieData(rankedVsRegularToggleValue, mode, map, brawler, targetAttribute, playerTag, "overall", false, () => { });
        }

        if (!rawData || rawData.length === 0) {
            setChartData([]);
            return;
        }

        let jsonData = JSON.parse(rawData);

        // Global function returns an array of data points over time. Only use a single one
        if (isGlobal) {
            jsonData = jsonData[0];
        }

        // Handle maps if provided
        const potentialMaps = jsonData['potentialMaps'] || [];
        if (potentialMaps.length > 0) {
            setMapLabels(
                potentialMaps.map((map: string) => ({
                    value: map,
                    label: map
                }))
            );
        } else if (map == "") {
            setMapLabels([]);
        }

        const trieData = jsonData['trieData'] || [];

        const mapped = trieData.map((item: any) => {
            const value = targetAttribute === "type" ? item.pathID.split('$')[2] : item.pathID.split('$').pop() || '';
            const winrate = (item.resultCompiler.player_result_data.wins / item.resultCompiler.player_result_data.potential_total);
            const starRate = item.resultCompiler.player_star_data.potential_total == 0 ? 0 : (
                (item.resultCompiler.player_star_data.wins + item.resultCompiler.player_star_data.losses + item.resultCompiler.player_star_data.draws)
                / item.resultCompiler.player_star_data.potential_total
            );
            const numGames = item.resultCompiler.player_result_data.potential_total;
            const trophyChange = item.resultCompiler.player_trophy_change;
            const frequencies = item.resultCompiler.duration_frequencies?.frequencies || {};

            // Calculate average duration from frequencies
            const totalOccurrences: any = Object.values(frequencies).reduce((sum: any, count: any) => sum + count, 0);
            const durationBucketSize = 30;
            const averageDuration =
                totalOccurrences === 0
                    ? 0
                    : Object.entries(frequencies).reduce(
                        (sum, [duration, count]) => sum + Number(duration) * Number(count),
                        0
                    ) / totalOccurrences * durationBucketSize + durationBucketSize / 2; // Convert to seconds

            return {
                value: value,
                winrate: winrate,
                starRate: starRate,
                numGames: numGames,
                trophyChange: trophyChange,
                trophyChangePerGame: numGames > 0 ? (trophyChange / numGames) : 0,
                winrateMinusStarRate: winrate - starRate,
                averageDuration: averageDuration
            };
        });

        setChartData(mapped);

        sortChartData();
    }

    const [pageStartingIndex, setPageStartingIndex] = useState(0);
    // const pageSize = (window ? window.innerWidth : 1000 < 900 ? 8 : 10);
    const pageSize = 10;

    const totalPages = Math.max(1, Math.ceil(chartData.length / pageSize));
    const paginatedData = chartData.slice(pageStartingIndex, pageStartingIndex + pageSize);

    useEffect(() => {
        fetchAndSetChartData();
    }, [brawler, mode, rankedVsRegularToggleValue, map, targetAttribute, playerData[playerTag]?.name]);
    useEffect(() => {
        setPageStartingIndex(0);
    }, [chartData]);
    useEffect(() => {
        sortChartData();
    }, [statType, sortingStatType]);

    return (
        <Card className="border-none rounded-none shadow-none h-[calc(100svh-var(--header-height))]! bg-(--secondary)">
            <CardHeader className="block justify-between items-start">
                <CardTitle className="text-3xl font-bold mb-4" style={{ textShadow: "0 4px 16px var(--chart-1), 0 2px 8px var(--chart-1)" }}>BoltGraph</CardTitle>

                <div className="flex flex-col">
                    <div className="flex flex-col py-2">
                        <div className="font-semibold text-lg mb-2">Query</div>
                        <div className="flex flex-wrap gap-3">
                            <CustomSelector
                                value={rankedVsRegularToggleValue}
                                setValue={updateRegularVsRankedToggleValueAndDependents}
                                labels={rankedVsRegularToggleLabels}
                                noChoiceLabel="Select Type..."
                                searchPlaceholder="Search Types..."
                                emptySearch="No Type Found"
                                disabled={targetAttribute == "type"}
                                searchEnabled={false}
                                canBeEmpty={false}
                                hoverMessage={targetAttribute == "type" ? "Change x-axis to something other than type to modify this value!" : ""}
                            />
                            <CustomSelector
                                value={mode}
                                setValue={setModeAndUpdateMap}
                                labels={rankedVsRegularToggleValue == "regular" ? modeLabels : rankedModeLabels}
                                noChoiceLabel="Select Mode..."
                                searchPlaceholder="Search Modes..."
                                emptySearch="No Mode Found"
                                disabled={targetAttribute == "mode"}
                                canBeEmpty={targetAttribute != "map"}
                                hoverMessage={targetAttribute == "mode" ? "Change x-axis to something other than mode to modify this value!" : ""}
                            />
                            {!isGlobal && (
                                <CustomSelector
                                    value={map}
                                    setValue={setMap}
                                    labels={mapLabels}
                                    noChoiceLabel="Select Map..."
                                    searchPlaceholder="Search Maps..."
                                    emptySearch={mode == "" ? "Choose a mode first!" : "No Map Found"}
                                    disabled={targetAttribute == "map" || targetAttribute == "mode"}
                                    hoverMessage={targetAttribute == "map" || targetAttribute == "mode" ? "Change x-axis to something other than map or mode to modify this value!" : ""}
                                />
                            )}
                            <CustomSelector
                                value={brawler}
                                setValue={setBrawler}
                                labels={brawlerLabels}
                                noChoiceLabel="Select Brawler..."
                                searchPlaceholder="Search Brawlers..."
                                emptySearch="No Brawler Found"
                                disabled={targetAttribute == "brawler"}
                                hoverMessage={targetAttribute == "brawler" ? "Change x-axis to something other than brawler to modify this value!" : ""}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col py-2">
                        <div className="font-semibold text-lg mb-2">Graph Settings</div>
                        <div className="flex flex-wrap gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">X-Axis:</label>
                                <CustomSelector
                                    value={targetAttribute}
                                    setValue={setTargetAttributeAndUpdateOtherAttributes}
                                    labels={targetAttributeLabels}
                                    noChoiceLabel="Select Target Attribute..."
                                    searchPlaceholder="Search Attributes..."
                                    emptySearch="No Attribute Found"
                                    canBeEmpty={false}
                                    searchEnabled={false}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Y-Axis:</label>
                                <CustomSelector
                                    value={statType}
                                    setValue={setStatTypeAndUpdateDependents}
                                    labels={statTypeLabels}
                                    noChoiceLabel="Select Stat Type..."
                                    searchPlaceholder="Search Stat Types..."
                                    emptySearch="No Stat Type Found"
                                    canBeEmpty={false}
                                    searchEnabled={false}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Sorting:</label>
                                <CustomSelector
                                    value={sortingStatType}
                                    setValue={setSortingStatType}
                                    labels={sortingTypeLabels}
                                    noChoiceLabel="Select Sorting Type..."
                                    searchPlaceholder="Search Sorting Types..."
                                    emptySearch="No Sorting Type Found"
                                    canBeEmpty={false}
                                    searchEnabled={false}
                                    disabled={sortByStatType}
                                />
                                <div className="flex items-center gap-2 pt-2">
                                    <Checkbox
                                        id={"sortByStatType" + playerTag}
                                        checked={sortByStatType}
                                        onCheckedChange={() => {
                                            setSortByStatType(prev => !prev);
                                            if (!sortByStatType) {
                                                setSortingStatType(statType === "winrateMinusStarRate" ? "winrate" : statType);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <label
                                        htmlFor={"sortByStatType" + playerTag}
                                        className="flex items-center gap-1 cursor-pointer"
                                        title="Lock sorting type to y-axis value"
                                    >
                                        <LockIcon size={16} className="text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Lock to y-axis value</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CardHeader>

            <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        accessibilityLayer
                        data={paginatedData}
                        margin={{ bottom: 40 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeWidth={0.1}
                        />

                        <XAxis
                            dataKey="value"
                            tickLine={false}
                            tickMargin={2}
                            axisLine={false}
                            // angle={window.innerWidth < 900 ? -90 : -45}
                            angle={-45}
                            textAnchor="end"
                            tickFormatter={(tick: string) => {
                                return modeLabelMap[tick as keyof typeof modeLabelMap]
                                    ?? tick//Title Case
                                        .toLowerCase()
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
                            }}
                            // tick={window.innerWidth < 900 ? { fontSize: 12 } : {}}
                        />

                        <YAxis
                            type="number"
                            domain={statType == "winrateMinusStarRate" ? [0, 1] : undefined}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<CustomPlayerTooltip />}
                        />

                        {statType === "winrateMinusStarRate" && (
                            <Bar
                                dataKey={"starRate"}
                                fill={"var(--chart-3)"}
                                stackId={"a"}
                            />
                        )}
                        <Bar
                            dataKey={statType}
                            radius={[8, 8, 0, 0]}
                            fill={"var(--chart-1)"}
                            stackId={"a"}
                        />

                        <ReferenceLine
                            y={Math.max(...paginatedData.map((item: { [x: string]: any; }) => {

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

            <CardFooter className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    disabled={pageStartingIndex === 0}
                    onClick={() => {
                        setPageStartingIndex(prev => Math.max(0, prev - pageSize));
                    }}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground self-center">
                    Page {Math.floor(pageStartingIndex / pageSize + 1)} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    disabled={(pageStartingIndex / pageSize + 1) >= totalPages}
                    onClick={() => {
                        setPageStartingIndex(prev => Math.min(totalPages * pageSize - 1, prev + pageSize));
                    }}
                >
                    Next
                </Button>
            </CardFooter>

        </Card>
    )
}