import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { ModeSelector } from "../Selectors/ModeSelector";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useState } from "react";

function getChartDataForRankCompiler(rankCompiler: any) {
    if (!rankCompiler) return [];

    return Object.entries(rankCompiler.frequencies).map(([rank, games]) => {
        return {
            games, rank
        };
    });
}

export const ShowdownRankChart = ({ playerTag }: { playerTag: string }) => {

    const {
        playerData
    } = usePlayerData();

    const chartConfig = {
        desktop: {
            label: "games",
        },
    } satisfies ChartConfig;

    const showdownModes = [
        { "value": "soloShowdown", "label": "Solo Showdown" },
        { "value": "duoShowdown", "label": "Duo Showdown" },
        { "value": "trioShowdown", "label": "Trio Showdown" },
    ]

    const [showdownMode, setShowdownMode] = useState('soloShowdown');

    const chartData = !playerTag ? [] : getChartDataForRankCompiler(playerData[playerTag].playerStats.showdownRankDistributions[showdownMode]);

    return (
        <Card className="border-none">
            <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold mb-4">Showdown Rank Distribution</CardTitle>

                <ModeSelector mode={showdownMode} setMode={setShowdownMode} selectModeLabels={showdownModes} />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="rank"
                        />

                        <YAxis
                            tickCount={3}
                            key="games"
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Bar dataKey='games' radius={[8, 8, 0, 0]} fill="#666666" />

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
    )
}