import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";
import { StatTypeSelector } from "../Selectors/StatTypeSelector";
import { ModeSelector } from "../Selectors/ModeSelector";
import { BrawlerSelector } from "../Selectors/BrawlerSelector";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { boltColors, brawlerLabels, modeLabelMap, modeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { ChartTooltip } from "@/components/ui/chart";
import { LucideFrown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomSelector } from "../Selectors/CustomSelector";
import { fetchTrieData, handlePlayerSearch } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { Button } from "@/components/ui/button";

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
    const [mode, setMode] = useState("brawlBall");
    const [map, setMap] = useState("");
    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("regular");

    const [statType, _setStatType] = useState("winrate");
    const setStatTypeAndUpdateOverallToggle = (value: string): void => {
        if (rankedVsRegularToggleValue === "ranked" && (value === "trophyChange" || value === "trophyChangePerGame")) {
            setRankedVsRegularToggleValue("regular");
        }
        _setStatType(value);
    }

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

        const targetAttribute = "map";

        const rawData = await fetchTrieData(rankedVsRegularToggleValue, mode, "", brawler, targetAttribute, playerTag, "overall", () => { });
        if (!rawData || rawData.length === 0) {
            setChartData([]);
            return;
        }

        const jsonData = JSON.parse(rawData);

        const mapped = jsonData.map((item: any) => {
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

        // mapped.sort((a: any, b: any) => {
        //     if (statType === "winrate" || statType === "starRate") {
        //         return b[statType] - a[statType];
        //     } else {
        //         return Math.abs(b[statType]) - Math.abs(a[statType]);
        //     }
        // });

        setChartData(mapped);

        sortChartData();
    }

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const totalPages = Math.ceil(chartData.length / pageSize);
    const paginatedData = chartData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);


    useEffect(() => {
        fetchAndSetChartData();
    }, [brawler, mode, rankedVsRegularToggleValue, map]);

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
                    <CardTitle className="text-2xl font-bold mb-4">Recursive Stat Chart</CardTitle>


                    <div className="flex items-center gap-3 py-2">
                        <RegularRankedToggle
                            rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                            setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
                            statType={statType}
                        />
                    </div>
                    <div className="flex items-center gap-3 py-2">
                        map selector
                    </div>
                    <div className="flex items-center gap-3 py-2">
                        <CustomSelector
                            value={mode}
                            setValue={setMode}
                            labels={modeLabels}
                            noChoiceLabel="Select Mode..."
                            searchPlaceholder="Search Modes..."
                            emptySearch="No Mode Found" />
                    </div>
                    <div className="flex items-center gap-3 py-2">
                        <CustomSelector
                            value={brawler}
                            setValue={setBrawler}
                            labels={brawlerLabels}
                            noChoiceLabel="Select Brawler..."
                            searchPlaceholder="Search Brawlers..."
                            emptySearch="No Brawler Found" />
                    </div>

                    <StatTypeSelector statType={statType} setStatType={setStatTypeAndUpdateOverallToggle} />


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