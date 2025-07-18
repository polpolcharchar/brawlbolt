import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CarouselApi } from "@/components/ui/carousel";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip
} from "@/components/ui/chart";
import { brawlerLabels, modeLabels, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { fetchGlobalStats } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CustomSelector } from "../Selectors/CustomSelector";
import { LinearNaturalChartToggle } from "../Selectors/LinearNaturalChartToggle";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";
import { Frown } from "lucide-react";

const chartConfig = {
    winrate: {
        label: "Winrate",
        color: "var(--chart-1)",
    },
    starRate: {
        label: "Star Rate",
        color: "var(--chart-2)",
    }
} satisfies ChartConfig;

interface Stat {
    date: string | number;
    winrate: number;
    starRate: number;
    resultPotentialTotal: number;
}

export const BrawlerOverTimeChart = ({
    mode,
    setMode,
    rankedVsRegularToggleValue,
    setRankedVsRegularToggleValue,
    brawler,
    setBrawler,
    carouselApi,
    isActive
}: {
    mode: string,
    setMode: (value: string) => void,
    rankedVsRegularToggleValue: string,
    setRankedVsRegularToggleValue: (value: string) => void,
    brawler: string,
    setBrawler: (value: string) => void,
    carouselApi: CarouselApi | null | undefined,
    isActive: boolean
}) => {


    const [brawlerTimeData, setBrawlerTimeData] = useState<Record<string, any>>({});
    const updateBrawlerTimeData = (key: string, value: any) => {
        setBrawlerTimeData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const [chartData, setChartData] = useState<Stat[]>([]);

    const [chartType, setChartType] = useState<"linear" | "natural">("linear");

    const fetchData = async (rankedVsRegularToggleValue: string, mode: string, brawler: string) => {

        const statTypeString = rankedVsRegularToggleValue + mode + brawler;

        if (brawlerTimeData[statTypeString] !== undefined) {
            if (brawlerTimeData[statTypeString] !== "temp") {
                setChartData(brawlerTimeData[statTypeString]);
            }
            return;
        }
        brawlerTimeData[statTypeString] = "temp";

        const stats = await fetchGlobalStats(
            10,
            rankedVsRegularToggleValue,
            mode,
            brawler,
            ""
        );

        if (!stats) {
            setChartData([]);
            return;
        }

        const parsedStats: any = JSON.parse(stats);

        const chartDataStats = parsedStats.map((item: any) => {

            if (item["trieData"].length == 0) {
                return undefined;
            }

            const resultCompiler = item["trieData"][0]["resultCompiler"];

            const player_result_data = resultCompiler["player_result_data"];
            const player_star_data = resultCompiler["player_star_data"];

            const winrate = (player_result_data["wins"] / player_result_data["potential_total"]);
            const starRate = ((player_star_data["wins"] + player_star_data["losses"] + player_star_data["draws"]) / player_star_data["potential_total"]);


            return {
                date: new Date(item.datetime).getTime(),
                winrate: winrate * 100,
                starRate: starRate * 100,
                resultPotentialTotal: player_result_data["potential_total"],
            }

        }).filter((a: any) => a);



        if (stats) setChartData(chartDataStats);
        else setChartData([]);

        updateBrawlerTimeData(statTypeString, chartDataStats);
    };

    useEffect(() => {
        const snapValue = carouselApi?.selectedScrollSnap();
        if (isActive && snapValue !== undefined && snapValue == 2) {
            fetchData(rankedVsRegularToggleValue, mode, brawler);
        }

    }, [mode, rankedVsRegularToggleValue, brawler, isActive]);

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="block justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-bold mb-4">Global Brawler History</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4">
                    <RegularRankedToggle
                        rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                        setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
                        statType="duration"
                    />
                    <CustomSelector
                        value={mode}
                        setValue={setMode}
                        labels={rankedVsRegularToggleValue == "regular" ? modeLabels : rankedModeLabels}
                        noChoiceLabel="Select Mode..."
                        searchPlaceholder="Search Modes..."
                        emptySearch="No Mode Found"
                    />
                    <CustomSelector
                        value={brawler}
                        setValue={setBrawler}
                        labels={brawlerLabels}
                        noChoiceLabel="Select Brawler..."
                        searchPlaceholder="Search Brawlers..."
                        emptySearch="No Brawler Found"
                        canBeEmpty={false}
                    />
                    <LinearNaturalChartToggle type={chartType} setType={setChartType} />

                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[50vh] w-full">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillWinrate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="var(--chart-1)" stopOpacity={1} />
                                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                            </linearGradient>
                            <linearGradient id="fillStarRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="var(--chart-2)" stopOpacity={1} />
                                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            type="number"
                            scale="time"
                            dataKey="date"
                            domain={['auto', 'auto']}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            }
                        />
                        <YAxis
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            width={40}
                            tickFormatter={(value) => `${value}%`}
                            ticks={[16.6, 33.3, 50, 66.6]}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={({ payload }) => {
                                if (payload && payload.length > 0) {
                                    const dateValue = payload[0].payload.date;
                                    const { winrate, starRate } = payload[0].payload;
                                    return (
                                        <div className="rounded-lg bg-black text-white px-4 py-2 shadow-lg max-w-xs pointer-events-none">
                                            <p className="font-bold text-center mb-2">
                                                {new Date(dateValue).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <p className="text-left mb-1 flex items-center gap-2">
                                                <span
                                                    className="w-3 h-3 rounded-sm"
                                                    style={{ backgroundColor: "var(--chart-1)" }}
                                                ></span>
                                                Winrate: {winrate.toFixed(2)}%
                                            </p>
                                            <p className="text-left flex items-center gap-2">
                                                <span
                                                    className="w-3 h-3 rounded-sm"
                                                    style={{ backgroundColor: "var(--chart-2)" }}
                                                ></span>
                                                Star Rate: {starRate.toFixed(2)}%
                                            </p>
                                            <p className="text-xs text-gray-400 mb-0">
                                                from {payload[0].payload.resultPotentialTotal} games
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            dataKey="winrate"
                            type={chartType}
                            fill="url(#fillWinrate)"
                            stroke="var(--chart-1)"
                            stackId="a"
                        />
                        <Area
                            dataKey="starRate"
                            type={chartType}
                            fill="url(#fillStarRate)"
                            stroke="var(--chart-2)"
                            stackId="b"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ReferenceLine
                            y={Math.max(...chartData.map(item => {

                                const x = item["winrate" as keyof typeof item];

                                if (x) {
                                    return Number(x);
                                }
                                return 0;
                            })) * 0.7}
                            label="brawlbolt.com"
                            strokeWidth={0}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <Frown/>
                <p className="text-sm text-gray-400 text-center mx-2">
                    {"Past global statistics have resently been reset due to a change in BrawlBolt formatting. This will very likely not happen again."}
                </p>
            </CardFooter>
        </Card>
    );
};
