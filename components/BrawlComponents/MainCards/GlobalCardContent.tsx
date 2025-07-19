import { CardHeader } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BrawlerOverTimeChart } from "../Charts/BrawlerOverTimeChart";
import { TrieExplorerChart } from "../Charts/TrieExplorerChart";
import { columns } from "../Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "../Tables/BrawlerTable/GlobalBrawlerTable";


export const GlobalCardContent = () => {

    const [api, setApi] = useState<CarouselApi | null>(null);

    const [mode, setMode] = useState("");
    const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("ranked");
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

        <div className="relative w-full mx-auto">

            {/* Custom Carousel Controls */}
            <div className="flex justify-center items-center gap-2 mb-2 relative min-h-[80px]">
                {/* Left button with label */}
                <div className="absolute left-0 flex items-center h-full">
                    <button
                        onClick={() => api?.scrollPrev()}
                        disabled={activeSlide === 0}
                        className={`flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed ml-4 border
    ${activeSlide === 0 ? '' : 'subtleRotateWiggle'} cursor-pointer`}
                        style={{ animationDelay: activeSlide === 0 ? undefined : '0s' }}
                        title="Previous Slide"
                    >
                        <ChevronLeft
                            className={`w-10 h-10 ${activeSlide === 0 ? 'text-muted-foreground' : ''}`}
                        />
                        <span className="text-md font-medium text-center truncate pointer-events-none select-none text-left">
                            {activeSlide === 0 ? '' : activeSlide === 1 ? 'Trie' : 'Brawler Table'}
                        </span>
                    </button>

                </div>

                {/* Center label, always centered */}
                <div className="flex-1 flex justify-center text-4xl font-bold">
                    {"Global Statistics"}
                </div>

                {/* Right button with label */}
                <div className="absolute right-0 flex items-center h-full">
                    <button
                        onClick={() => api?.scrollNext()}
                        className={`flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed mr-4 border 
              ${activeSlide === 2 ? '' : 'subtleRotateWiggle'} cursor-pointer`}
                        style={{ animationDelay: activeSlide === 2 ? undefined : '5s' }}
                        title="Next Slide"
                        disabled={activeSlide === 2}
                    >
                        <span className="text-md font-medium text-center truncate pointer-events-none select-none text-right">
                            {activeSlide === 0 ? 'Brawler Table' : activeSlide === 1 ? 'Brawler History' : ''}
                        </span>
                        <ChevronRight
                            className={`w-10 h-10 ${activeSlide === 2 ? 'text-muted-foreground' : ''}`}
                        />
                    </button>

                </div>
            </div>

            <Carousel className="w-full" opts={{ loop: false, watchDrag: false, startIndex: 1 }} setApi={setApi}>
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
    )
}