import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { brawlerLabels, modeLabelMap, modeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { fetchTrieData } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CustomSelector } from "../Selectors/CustomSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { LockIcon } from "lucide-react";

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

export const TrieExplorerChart = ({ playerTag }: { playerTag: string }) => {

    const [brawler, setBrawler] = useState("");
    const [mode, setMode] = useState("");
    const setModeAndUpdateMap = (value: string): void => {
        //If mode is set to nothing, set map to nothing as well
        if (value === "" || targetAttribute === "type") {
            setMap("");
        }
        setMode(value);
    }
    const [map, setMap] = useState("");

    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("regular");
    const [rankedVsRegularToggleLabels] = useState<{ value: string; label: string }[]>([
        { value: "regular", label: "Regular" },
        { value: "ranked", label: "Ranked" }
    ]);

    const [statType, _setStatType] = useState("winrateMinusStarRate");
    const setStatTypeAndUpdateOverallToggle = (value: string): void => {
        if (rankedVsRegularToggleValue === "ranked" && (value === "trophyChange" || value === "trophyChangePerGame")) {
            setRankedVsRegularToggleValue("regular");
        }

        if (sortByStatType) {

            if (value === "winrateMinusStarRate") {
                setSortingStatType("winrate");
            } else {
                setSortingStatType(value);
            }

        }

        _setStatType(value);
    }

    const [targetAttribute, setTargetAttribute] = useState("brawler");
    const setTargetAttributeAndUpdateOtherAttributes = (value: string): void => {
        setTargetAttribute(value);
        if (value == "map" && mode === "") {
            setModeAndUpdateMap("brawlBall");
        }

        if (value != "type" && rankedVsRegularToggleValue == "") {
            setRankedVsRegularToggleValue("regular");
        }

        if (value == "map") {
            setMap("");
        } else if (value == "brawler") {
            setBrawler("");
        } else if (value == "mode") {
            setMode("");
        } else if (value == "type") {
            setRankedVsRegularToggleValue("");
        }
    }
    const [targetAttributeLabels] = useState<{ value: string; label: string }[]>([
        { value: "mode", label: "Mode" },
        { value: "brawler", label: "Brawler" },
        { value: "map", label: "Map" },
        { value: "type", label: "Type" }
    ]);

    const [mapLabels, setMapLabels] = useState<{ value: string; label: string }[]>([]);

    const [sortingStatType, setSortingStatType] = useState("numGames");
    const [sortByStatType, setSortByStatType] = useState(false);

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

        const rawData = await fetchTrieData(rankedVsRegularToggleValue, mode, map, brawler, targetAttribute, playerTag, "overall", false, () => { });
        if (!rawData || rawData.length === 0) {
            setChartData([]);
            return;
        }

        const jsonData = JSON.parse(rawData);

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
            const averageDuration =
                totalOccurrences === 0
                    ? 0
                    : Object.entries(frequencies).reduce(
                        (sum, [duration, count]) => sum + Number(duration) * Number(count),
                        0
                    ) / totalOccurrences * 30; // Convert to seconds

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
    const pageSize = 10;

    const totalPages = Math.max(1, Math.ceil(chartData.length / pageSize));
    const paginatedData = chartData.slice(pageStartingIndex, pageStartingIndex + pageSize);

    useEffect(() => {
        fetchAndSetChartData();
    }, [brawler, mode, rankedVsRegularToggleValue, map, targetAttribute]);
    useEffect(() => {
        setPageStartingIndex(0);
    }, [chartData]);
    useEffect(() => {
        sortChartData();
    }, [statType, sortingStatType]);

    return (
        <div>
            <Card className="border-none">
                <CardHeader className="block justify-between items-start">
                    <CardTitle className="text-2xl font-bold mb-4">Trie Explorer</CardTitle>

                    <div className="flex flex-row gap-10">
                        {/* First column: RegularRankedToggle, Mode, Map, Brawler */}
                        <div className="flex flex-col gap-3 py-2 max-w-[200px] w-full">
                            <div className="font-semibold text-lg mb-2">Trie Query</div>
                            <div>
                                <CustomSelector
                                    value={rankedVsRegularToggleValue}
                                    setValue={setRankedVsRegularToggleValue}
                                    labels={rankedVsRegularToggleLabels}
                                    noChoiceLabel="Select Type..."
                                    searchPlaceholder="Search Types..."
                                    emptySearch="No Type Found"
                                    disabled={targetAttribute == "type"}
                                    searchEnabled={false}
                                    canBeEmpty={false} />
                            </div>
                            <div>
                                <CustomSelector
                                    value={mode}
                                    setValue={setModeAndUpdateMap}
                                    labels={modeLabels}
                                    noChoiceLabel="Select Mode..."
                                    searchPlaceholder="Search Modes..."
                                    emptySearch="No Mode Found"
                                    disabled={targetAttribute == "mode"}
                                    canBeEmpty={targetAttribute != "map"} />
                            </div>
                            <div>
                                <CustomSelector
                                    value={map}
                                    setValue={setMap}
                                    labels={mapLabels}
                                    noChoiceLabel="Select Map..."
                                    searchPlaceholder="Search Maps..."
                                    emptySearch={mode == "" ? "Choose a mode first!" : "No Map Found"}
                                    disabled={targetAttribute == "map" || targetAttribute == "mode"} />
                            </div>
                            <div>
                                <CustomSelector
                                    value={brawler}
                                    setValue={setBrawler}
                                    labels={brawlerLabels}
                                    noChoiceLabel="Select Brawler..."
                                    searchPlaceholder="Search Brawlers..."
                                    emptySearch="No Brawler Found"
                                    disabled={targetAttribute == "brawler"} />
                            </div>
                        </div>
                        {/* Second column: Target Attribute, Stat Type */}
                        <div className="flex flex-col gap-3 py-2 max-w-[200px] w-full">
                            <div className="font-semibold text-lg mb-2">Graph Settings</div>
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
                                    searchEnabled={false} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Y-Axis:</label>
                                <CustomSelector
                                    value={statType}
                                    setValue={setStatTypeAndUpdateOverallToggle}
                                    labels={[
                                        { value: "winrateMinusStarRate", label: "Winrate" },
                                        { value: "trophyChange", label: "Trophy Change" },
                                        { value: "trophyChangePerGame", label: "Trophy Change / Game" },
                                        { value: "averageDuration", label: "Average Duration" },
                                        { value: "numGames", label: "Games Played" },
                                    ]}
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
                                    labels={[
                                        { value: "winrate", label: "Winrate" },
                                        { value: "starRate", label: "Star Rate" },
                                        { value: "trophyChange", label: "Trophy Change" },
                                        { value: "trophyChangePerGame", label: "Trophy Change / Game" },
                                        { value: "averageDuration", label: "Average Duration" },
                                        { value: "numGames", label: "Games Played" },
                                    ]}
                                    noChoiceLabel="Select Sorting Type..."
                                    searchPlaceholder="Search Sorting Types..."
                                    emptySearch="No Sorting Type Found"
                                    canBeEmpty={false}
                                    searchEnabled={false}
                                    disabled={sortByStatType}
                                />
                                <div className="flex items-center gap-2 pt-2">
                                    <Checkbox
                                        id="sortByStatType"
                                        checked={sortByStatType}
                                        onCheckedChange={() => {
                                            setSortByStatType(prev => !prev);

                                            // When toggling on, set sortingStatType to the current statType
                                            if (!sortByStatType) {
                                                setSortingStatType(statType === "winrateMinusStarRate" ? "winrate" : statType);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <label
                                        htmlFor="sortByStatType"
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
                </CardHeader>

                <CardContent className="h-[40vh]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            accessibilityLayer
                            data={paginatedData}
                            margin={{ bottom: 100 }}
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
                                angle={window.innerWidth < 900 ? -90 : -45}
                                textAnchor="end"
                                tickFormatter={(tick: string) => {

                                    return modeLabelMap[tick as keyof typeof modeLabelMap]
                                        ?? tick//Title Case
                                            .toLowerCase()
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ');
                                }}
                                tick={window.innerWidth < 900 ? { fontSize: 12 } : {}}
                            />

                            <YAxis
                                type="number"
                                // tickFormatter={(tick) => Math.abs(tick) > 1 || tick === 0 ? tick : tick.toFixed(2)} // Formats labels (e.g., "0.50")
                                domain={statType == "winrateMinusStarRate" ? [0, 1] : undefined}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={<CustomPlayerTooltip />}
                            />

                            {statType === "winrateMinusStarRate" && (
                                <Bar
                                    dataKey={"starRate"}
                                    fill={"var(--chart-2)"}
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
                            let count = 0;
                            const interval = setInterval(() => {
                                setPageStartingIndex(prev => {
                                    const next = Math.max(0, prev - 1);
                                    return next;
                                });
                                count++;
                                if (count >= pageSize) {
                                    clearInterval(interval);
                                }
                            }, 20);
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
                            let count = 0;
                            const interval = setInterval(() => {
                                setPageStartingIndex(prev => {
                                    const next = Math.min(totalPages * pageSize - 1, prev + 1);
                                    return next;
                                });
                                count++;
                                if (count >= pageSize) {
                                    clearInterval(interval);
                                }
                            }, 20);
                        }}
                    >
                        Next
                    </Button>
                </CardFooter>

            </Card>
        </div >
    )

}