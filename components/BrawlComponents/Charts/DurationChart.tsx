import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { ModeSelector } from "../Selectors/ModeSelector";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { boltColors } from "@/lib/BrawlUtility/BrawlConstants";
import { RegularRankedToggle } from "../Selectors/RegularRankedToggle";


function getDurationChartData(frequencyCompiler: any) {
    if (!frequencyCompiler) return [];

    return Object.entries(frequencyCompiler.frequencies).map(([duration, games]) => {
        return {
            duration, games
        };
    });
}

export const DurationChart = ({ playerTag }: { playerTag: string }) => {

    const durationBucketSize = 30;

    const {
        playerData
    } = usePlayerData();

    const chartConfig = {
        desktop: {
            label: "games",
        },
    } satisfies ChartConfig;

    const [mode, setMode] = useState("");
    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("regular");

    const baseMap = rankedVsRegularToggleValue == "regular" ? playerData[playerTag].playerStats.regularModeMapBrawler : playerData[playerTag].playerStats.rankedModeMapBrawler;
    const chartData = !playerTag ? [] : getDurationChartData(
        (mode === "") ?
            baseMap.overallResults.durationFrequencies
            :
            baseMap.stat_map[mode]?.overallResults?.durationFrequencies);

    if (playerTag === "Global") {
        return (
            <Card className="border-none w-full h-full flex items-center justify-center shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold">
                    Duration Data Unavailable for Global Statistics!
                </h2>
            </Card>
        )
    }

    return (
        <Card className="border-none">
            <CardHeader className="block justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-bold mb-4">Match Duration Distribution</CardTitle>
                </div>

                <div className="flex flex-wrap gap-4">
                    <RegularRankedToggle rankedVsRegularToggleValue={rankedVsRegularToggleValue} setRankedVsRegularToggleValue={setRankedVsRegularToggleValue} statType="duration" />
                    <ModeSelector mode={mode} setMode={setMode} />
                </div>
            </CardHeader>
            <CardContent className="">
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="duration"
                            label={{ value: 'Duration', position: 'insideBottom', offset: -5 }}
                            tickFormatter={(tick) => {
                                return (tick * durationBucketSize).toFixed(0) + "-" + ((Number.parseInt(tick) + 1) * durationBucketSize).toFixed(0)
                            }}
                        />
                        <YAxis label={{ value: 'Games', angle: -90, position: 'insideLeft' }} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="games" fill={boltColors.blue700} radius={[8, 8, 0, 0]} />
                        <ReferenceLine
                            y={Math.max(...chartData.map(item => {

                                return Number(item['games']);

                            })) * 0.7}
                            label="brawlbolt.com"
                            strokeWidth={0}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}