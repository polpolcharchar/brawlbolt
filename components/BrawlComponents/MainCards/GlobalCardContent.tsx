import { CardFooter, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { useState } from "react";
import { BrawlerOverTimeChart } from "../Charts/BrawlerOverTimeChart";
import { ShareSplashCard } from "../InfoCards/ShareSplashCard";
import { columns } from "../Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "../Tables/BrawlerTable/GlobalBrawlerTable";


export const GlobalCardContent = () => {

    const [api, setApi] = useState<CarouselApi | null>(null);

    const [mode, setMode] = useState("");
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
        <div>
            <div className="text-center">
                <CardHeader className="text-4xl font-bold">
                    {"Global Statistics"}
                </CardHeader>

                <ShareSplashCard />
            </div>

            <div className="relative w-full mx-auto">
                <Carousel className="w-full" opts={{ loop: false, watchDrag: false }} setApi={setApi}>
                    <CarouselContent>
                        <CarouselItem key="brawlerTable">
                            <GlobalBrawlerTable
                                columns={columns}
                                playerTag={"global"}
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
            </div>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-400 text-center mx-2">
                    {"Past global statistics have been reset due to a change in BrawlBolt formatting. This will very likely not happen again."}
                </p>
            </CardFooter>

        </div>
    )
}