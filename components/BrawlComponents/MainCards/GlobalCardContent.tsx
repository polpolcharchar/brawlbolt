import { CardFooter, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext } from "@/components/ui/carousel";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { useEffect, useState } from "react";
import { BrawlerOverTimeChart } from "../Charts/BrawlerOverTimeChart";
import { TrieExplorerChart } from "../Charts/TrieExplorerChart";
import { columns } from "../Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "../Tables/BrawlerTable/GlobalBrawlerTable";
import { ChevronLeft, ChevronRight } from "lucide-react";


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

    const [activeSlide, setActiveSlide] = useState(0);
    useEffect(() => {
        if (!api) return;

        const handleSelect = () => {
            setActiveSlide(api.selectedScrollSnap());
        };

        api.on("select", handleSelect);
        handleSelect(); // initialize on mount
    }, [api]);

    return (
        <div>
            <div className="text-center">
                <CardHeader className="text-4xl font-bold">
                    {"Global Statistics"}
                </CardHeader>

                {/* <ShareSplashCard /> */}
            </div>

            <div className="relative w-full mx-auto">

                {/* Custom Carousel Controls */}
                <div className="flex justify-center items-center gap-2 mb-2">
                    <button
                        onClick={() => api?.scrollPrev()}
                        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous Slide"
                        disabled={activeSlide === 0}
                    >
                        <ChevronLeft
                            className={`w-10 h-10 ${activeSlide === 0 ? "text-muted-foreground" : ""}`}
                        />
                    </button>

                    <p className="text-md font-medium text-center">
                        {activeSlide === 0 ? "Trie" : activeSlide === 1 ? "Brawler Table" : "Brawler History"}
                    </p>

                    <button
                        onClick={() => api?.scrollNext()}
                        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next Slide"
                        disabled={activeSlide === 2}
                    >
                        <ChevronRight
                            className={`w-10 h-10 ${activeSlide === 2 ? "text-muted-foreground" : ""}`}
                        />
                    </button>
                </div>

                <Carousel className="w-full" opts={{ loop: false, watchDrag: false, startIndex: 1}} setApi={setApi}>
                    <CarouselContent>
                        <CarouselItem key="trieExplorer">
                            <TrieExplorerChart playerTag={"global"} isGlobal={true} />
                        </CarouselItem>

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
                                isActive={activeSlide == 2}
                            />
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}