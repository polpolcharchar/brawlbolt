import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarouselApi } from "@/components/ui/carousel";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip
} from "@/components/ui/chart";
import { modeLabels, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { BrawlerSelector } from "../Selectors/BrawlerSelector";
import { LinearNaturalChartToggle } from "../Selectors/LinearNaturalChartToggle";
import { ModeSelector } from "../Selectors/ModeSelector";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";

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
}

export const BrawlerOverTimeChart = ({
    mode,
    setMode,
    rankedVsRegularToggleValue,
    setRankedVsRegularToggleValue,
    brawler,
    setBrawler,
    carouselApi,
    setTrigger,
}: {
    mode: string,
    setMode: (value: string) => void,
    rankedVsRegularToggleValue: string,
    setRankedVsRegularToggleValue: (value: string) => void,
    brawler: string,
    setBrawler: (value: string) => void,
    carouselApi: CarouselApi | null | undefined,
    setTrigger: (value: () => void) => void
}) => {
    

    const [brawlerTimeData, setBrawlerTimeData] = useState<Record<string, any>>({});
    const updateBrawlerTimeData = (key: string, value: any) => {
        setBrawlerTimeData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const [chartData, setChartData] = useState<Stat[]>([]);

    const [chartType, setChartType] = useState<"linear" | "natural">("natural");

    const changeBrawler = (newBrawler: string) => {
        if (newBrawler !== "") setBrawler(newBrawler);
    };

    const getChartDataFromRawTimeData = (timeData: any) => {
        return timeData.map((entry: any) => {
            const date = entry.datetime;
            const { wins, potential_total: resultPotentialTotal } = entry.stats.player_result_data;
            const winrate = (wins / resultPotentialTotal) * 100;

            const {
                wins: starWins,
                losses: starLosses,
                draws: starDraws,
                potential_total: starPotentialTotal,
            } = entry.stats.player_star_data;
            const starRate = ((starWins + starLosses + starDraws) / starPotentialTotal) * 100;

            return { date, winrate, starRate, resultPotentialTotal };
        });
    };

    const fetchStatOverTime = async (statType: string) => {

        try {
            const response = await fetch(
                "https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "getGlobalDataOverTime", statType }),
                }
            );

            if (response.ok) {
                const body = await response.text();
                const parsed = JSON.parse(body);
                return getChartDataFromRawTimeData(parsed);
            }
        } catch (error) {
            // console.error("Error fetching stats:", error);
            return [];
        } finally {

        }
    };

    const fetchData = async (statTypeString = rankedVsRegularToggleValue + mode + brawler) => {
        if (brawlerTimeData[statTypeString] !== undefined) {
            if (brawlerTimeData[statTypeString] !== "temp") {
                setChartData(brawlerTimeData[statTypeString]);
            }
            return;
        }
        brawlerTimeData[statTypeString] = "temp";

        const stats: Stat[] = await fetchStatOverTime(statTypeString) || [];
        stats.sort((a: { date: string | number }, b: { date: string | number }) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const numericalDates = stats.map(item => ({
            ...item,
            date: new Date(item.date).getTime(),
        }));
        if (stats) setChartData(numericalDates);
        else setChartData([]);

        updateBrawlerTimeData(statTypeString, numericalDates);
    };

    useEffect(() => {
        setTrigger(() => {
            return (statTypeString?: string) => {
                void fetchData(statTypeString ?? rankedVsRegularToggleValue + mode + brawler);
            }
        });

    }, [mode, rankedVsRegularToggleValue, brawler]);

    useEffect(() => {
        const scrollProgress: number | undefined = carouselApi?.scrollProgress();
        if (scrollProgress !== undefined && scrollProgress > 0.9 && scrollProgress < 1.1) {
            fetchData();
        }

    }, [mode, rankedVsRegularToggleValue, brawler]);

    return (
        <Card className="border-none">
            <div className="flex cursor-pointer text-sm text-gray-300 items-center ml-4" onClick={() => { carouselApi?.scrollPrev() }}>
                <ArrowLeft />
                <p>Back to table</p>
            </div>
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
                    <ModeSelector mode={mode} setMode={setMode} selectModeLabels={rankedVsRegularToggleValue == "regular" ? modeLabels : rankedModeLabels} />
                    <BrawlerSelector brawler={brawler} setBrawler={changeBrawler} />
                    <LinearNaturalChartToggle type={chartType} setType={setChartType} />

                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
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
        </Card>
    );
};
