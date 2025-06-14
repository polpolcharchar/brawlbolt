import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { AlertTriangle, ArrowLeft, ArrowRight, LucideAnnoyed, LucideBot, LucideFrown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselPrevious } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { BrawlerOverTimeChart } from "./Charts/BrawlerOverTimeChart";
import { DurationChart } from "./Charts/DurationChart";
import { RecursiveStatisticChart } from "./Charts/RecursiveStatisticChart";
import { ShowdownRankChart } from "./Charts/ShowdownRankChart";
import { ShareSplashCard } from "./InfoCards/ShareSplashCard";
import { LinkCopyIndicator } from "./Selectors/LinkCopyIndicator";
import { BrawlerDataTable } from "./Tables/BrawlerTable/BrawlerTable";
import { columns } from "./Tables/BrawlerTable/Columns";


export const PlayerCard = ({ playerTag }: { playerTag: string }) => {

    const {
        playerData
    } = usePlayerData();

    const [api, setApi] = useState<CarouselApi | null>(null);

    const [mode, setMode] = useState(playerTag === "Global" ? "brawlArena" : "");
    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("regular");
    const updateRankedVsRegularToggleValue = (newValue: string) => {
        if (newValue == "ranked" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] == undefined) {
            setMode(rankedModeLabels[0]['value']);
        }
        setRankedVsRegularToggleValue(newValue);
    }
    const [brawler, setBrawler] = useState("JACKY");

    const [trigger, setTrigger] = useState<(statTypeString: string) => void>(() => { });

    return (
        <Card className="w-full max-w-5xl mb-8 border-blue-700 border-2">

            {(typeof playerData[playerTag] !== "string") ? (
                <div className="text-center">
                    <CardHeader className="text-4xl font-bold">
                        {playerData[playerTag].playerInfo['name']}
                    </CardHeader>

                    {/* Share Splash */}
                    {(playerTag === "Global") && (
                        <ShareSplashCard />
                    )}

                    {/* Player tag and profile link */}
                    {(playerTag !== "Global") && (
                        <div className="flex justify-center">
                            <p className="text-sm text-gray-400 mx-2">{playerTag}</p>
                            <LinkCopyIndicator url={`brawlbolt.com/?tag=${playerTag}`} title="Copy profile link" />
                        </div>
                    )}

                    {/* Minimal Games Warning */}
                    {(playerTag !== "Global" && playerData[playerTag].playerStats.regularModeMapBrawler.overallResults.playerResultData.potentialTotal < 100) && (
                        <div className="flex flex-col items-center">
                            <Card className="bg-yellow-100 border-yellow-400 shadow-md p-4 rounded-2xl flex items-center w-fit max-w-lg m-2 text-center">
                                <AlertTriangle className="text-yellow-600 w-6 h-6 mr-3" />
                                <CardContent>
                                    <p className="text-yellow-800 font-medium">
                                        This account does not have many saved games yet!
                                    </p>
                                    <p className="text-yellow-800 font-medium">
                                        Keep playing and come back for higher accuracy!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>


            ) : (
                <CardHeader className="text-4xl font-bold justify-center">{playerTag}</CardHeader>
            )}

            {typeof playerData[playerTag] !== "string" ? (
                <div className="relative w-full mx-auto">

                    {playerTag === "Global" ? (
                        //Global Items
                        <Carousel className="w-full" opts={{ loop: false, watchDrag: false }} setApi={setApi}>
                            <CarouselContent>
                                <CarouselItem key="brawlerTable">
                                    <BrawlerDataTable
                                        columns={columns}
                                        playerTag={playerTag}
                                        mode={mode}
                                        setMode={setMode}
                                        rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                                        setRankedVsRegularToggleValue={updateRankedVsRegularToggleValue}
                                        onBrawlerClick={(clickedBrawler: string) => {
                                            setBrawler(clickedBrawler);
                                            if (api !== null) {
                                                api?.scrollNext();
                                                trigger(rankedVsRegularToggleValue + mode + clickedBrawler);
                                            }
                                        }}
                                    />
                                </CarouselItem>

                                <CarouselItem key="brawlerOverTimeChart">
                                    <BrawlerOverTimeChart
                                        mode={mode}
                                        setMode={setMode}
                                        rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                                        setRankedVsRegularToggleValue={updateRankedVsRegularToggleValue}
                                        brawler={brawler}
                                        setBrawler={setBrawler}
                                        carouselApi={api}
                                        setTrigger={setTrigger}
                                    />
                                </CarouselItem>
                            </CarouselContent>




                        </Carousel>
                    ) : (

                        // Normal Items:
                        <div>
                            <Carousel className="w-full" opts={{ loop: true, watchDrag: (window.innerWidth > 650) }} setApi={setApi}>
                                <CarouselContent>

                                    <CarouselItem key="modeMapChart">
                                        <RecursiveStatisticChart playerTag={playerTag} />
                                    </CarouselItem>

                                    <CarouselItem key="brawlerTable">
                                        <BrawlerDataTable
                                            columns={columns}
                                            playerTag={playerTag}
                                            onBrawlerClick={() => { }}
                                            rankedVsRegularToggleValue={rankedVsRegularToggleValue}
                                            setRankedVsRegularToggleValue={updateRankedVsRegularToggleValue}
                                            mode={mode}
                                            setMode={setMode}
                                        />
                                    </CarouselItem>

                                    <CarouselItem key="durationChart">
                                        <DurationChart playerTag={playerTag} />
                                    </CarouselItem>

                                    <CarouselItem key="showdownChart">
                                        <ShowdownRankChart playerTag={playerTag} />
                                    </CarouselItem>

                                    <CarouselItem key="rawData">
                                        <Card className="border-none w-full h-full flex items-center justify-center shadow-lg rounded-lg">
                                            <h2 className="text-2xl font-semibold">
                                                Coming Soon: Raw Data Viewer
                                            </h2>
                                        </Card>
                                    </CarouselItem>

                                    <CarouselItem key="matchHistory">
                                        <Card className="border-none w-full h-full flex items-center justify-center shadow-lg rounded-lg">
                                            <h2 className="text-2xl font-semibold">
                                                Coming Soon: Match History
                                            </h2>
                                        </Card>
                                    </CarouselItem>

                                </CarouselContent>

                                {window.innerWidth > 650 ? (
                                    <CardFooter className="justify-center text-sm text-gray-500">
                                        Swipe to view more charts
                                        <ArrowRight />
                                    </CardFooter>
                                ) : (
                                    <div className="flex justify-center pt-2">
                                        <div className="flex items-center justify-center w-10 h-10 border rounded-full cursor-pointer" onClick={() => { api?.scrollPrev() }}>
                                            <ArrowLeft />
                                        </div>
                                        <CardFooter className="justify-center text-sm text-gray-500">
                                            View more charts
                                        </CardFooter>
                                        <div className="flex items-center justify-center w-10 h-10 border rounded-full cursor-pointer" onClick={() => { api?.scrollNext() }}>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                )}



                            </Carousel>

                        </div>
                    )}

                    {window.innerWidth <= 650 && (
                        <CardFooter className="justify-center text-sm text-gray-500">
                            <LucideFrown />
                            {"BrawlBolt works better on desktop, sorry"}
                            <LucideFrown />
                        </CardFooter>
                    )}
                </div>
            ) : (
                //Loading:
                <div className="flex flex-col space-y-3 p-4">
                    <Skeleton className="h-[125px] w-full rounded-xl justify-center">{playerData[playerTag]}</Skeleton>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            )}

        </Card >
    )
}