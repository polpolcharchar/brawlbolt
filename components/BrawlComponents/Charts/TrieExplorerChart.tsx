import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { boltColors, brawlerLabels, modeLabelMap, modeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { fetchTrieData } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CustomSelector } from "../Selectors/CustomSelector";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";
import { StatTypeSelector } from "../Selectors/StatTypeSelector";

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

export const TrieExplorerChart = ({ playerTag }: { playerTag: string }) => {

    const [brawler, setBrawler] = useState("");
    const [mode, setMode] = useState("");
    const setModeAndUpdateMap = (value: string): void => {
        //If mode is set to nothing, set map to nothing as well
        if (value === "") {
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

    const [statType, _setStatType] = useState("winrate");
    const setStatTypeAndUpdateOverallToggle = (value: string): void => {
        if (rankedVsRegularToggleValue === "ranked" && (value === "trophyChange" || value === "trophyChangePerGame")) {
            setRankedVsRegularToggleValue("regular");
        }
        _setStatType(value);
    }

    const [targetAttribute, setTargetAttribute] = useState("mode");
    const setTargetAttributeAndUpdateOtherAttributes = (value: string): void => {
        setTargetAttribute(value);
        if (value == "map" && mode === "") {
            setModeAndUpdateMap("brawlBall");
        }

        if(value != "type" && rankedVsRegularToggleValue == ""){
            setRankedVsRegularToggleValue("regular");
        }

        if(value == "map"){
            setMap("");
        }else if(value == "brawler"){
            setBrawler("");
        }else if(value == "mode"){
            setMode("");
        }else if(value == "type"){
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

    const [chartData, setChartData] = useState<
        { value: string; winrate: number }[]
    >([]);
    const sortChartData = () => {
        setChartData((prevData) => {
            return [...prevData].sort((a: any, b: any) => {
                if (statType === "winrate" || statType === "starRate") {
                    return b[statType] - a[statType];
                } else {
                    return Math.abs(b[statType]) - Math.abs(a[statType]);
                }
            });
        });
    }
    const fetchAndSetChartData = async () => {

        const rawData = await fetchTrieData(rankedVsRegularToggleValue, mode, map, brawler, targetAttribute, playerTag, "overall", () => { });
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
        } else {
            setMapLabels([]);
        }

        const trieData = jsonData['trieData'] || [];

        const mapped = trieData.map((item: any) => {
            const value = item.pathID.split('$').pop() || '';
            const winrate = (item.resultCompiler.player_result_data.wins / item.resultCompiler.player_result_data.potential_total);
            const starRate = (
                (item.resultCompiler.player_star_data.wins + item.resultCompiler.player_star_data.losses + item.resultCompiler.player_star_data.draws)
                / item.resultCompiler.player_star_data.potential_total
            );
            const numGames = item.resultCompiler.player_result_data.potential_total;
            const trophyChange = item.resultCompiler.player_trophy_change;

            return {
                value: value,
                winrate: winrate,
                starRate: starRate,
                numGames: numGames,
                trophyChange: trophyChange,
                trophyChangePerGame: numGames > 0 ? (trophyChange / numGames) : 0
            };
        });

        setChartData(mapped);

        sortChartData();
    }

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const totalPages = Math.ceil(chartData.length / pageSize);
    const paginatedData = chartData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    useEffect(() => {
        fetchAndSetChartData();
    }, [brawler, mode, rankedVsRegularToggleValue, map, targetAttribute]);
    useEffect(() => {
        setCurrentPage(0);
    }, [chartData]);
    useEffect(() => {
        sortChartData();
    }, [statType]);

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
                                {/* <RegularRankedToggle
                                    rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                                    setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
                                    statType={statType}
                                /> */}
                                <CustomSelector
                                    value={rankedVsRegularToggleValue}
                                    setValue={setRankedVsRegularToggleValue}
                                    labels={rankedVsRegularToggleLabels}
                                    noChoiceLabel="Select Type..."
                                    searchPlaceholder="Search Types..."
                                    emptySearch="No Type Found"
                                    disabled={targetAttribute == "type"} />
                            </div>
                            <div>
                                <CustomSelector
                                    value={mode}
                                    setValue={setModeAndUpdateMap}
                                    labels={modeLabels}
                                    noChoiceLabel="Select Mode..."
                                    searchPlaceholder="Search Modes..."
                                    emptySearch="No Mode Found"
                                    disabled={targetAttribute == "mode"} />
                            </div>
                            <div>
                                <CustomSelector
                                    value={map}
                                    setValue={setMap}
                                    labels={mapLabels}
                                    noChoiceLabel="Select Map..."
                                    searchPlaceholder="Search Maps..."
                                    emptySearch={mode == "" ? "Choose a mode first!" : "No Map Found"}
                                    disabled={targetAttribute == "map"} />
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
                            <div className="font-semibold text-lg mb-2">What to graph</div>
                            <div>
                                <label className="block text-sm font-medium mb-1">X-Axis:</label>
                                <CustomSelector
                                    value={targetAttribute}
                                    setValue={setTargetAttributeAndUpdateOtherAttributes}
                                    labels={targetAttributeLabels}
                                    noChoiceLabel="Select Target Attribute..."
                                    searchPlaceholder="Search Attributes..."
                                    emptySearch="No Attribute Found"
                                    canBeEmpty={false} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Y-Axis:</label>
                                <StatTypeSelector statType={statType} setStatType={setStatTypeAndUpdateOverallToggle} />
                            </div>
                        </div>
                    </div>
                </CardHeader>


                <CardContent className="h-[60vh]">
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
                                    return modeLabelMap[tick as keyof typeof modeLabelMap] ?? tick;
                                }}
                                tick={window.innerWidth < 900 ? { fontSize: 12 } : {}}
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

                {/* {window.innerWidth <= 650 && chartData.length === 12 && (
                    <CardFooter className="justify-center text-sm text-gray-500">
                        <LucideFrown />
                        <p className="pl-2">{"Some entries omitted due to limited screen space"}</p>
                    </CardFooter>
                )} */}
                <CardFooter className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground self-center">
                        Page {currentPage + 1} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={(currentPage + 1) >= totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    >
                        Next
                    </Button>
                </CardFooter>

            </Card>
        </div >
    )

}