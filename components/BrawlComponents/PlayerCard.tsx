import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { DurationChart } from "./Charts/DurationChart";
import { RecursiveStatisticChart } from "./Charts/RecursiveStatisticChart";
import { ShowdownRankChart } from "./Charts/ShowdownRankChart";
import { Check, Copy, Share } from "lucide-react";
import { useState } from "react";


export const PlayerCard = ({ playerTag }: { playerTag: string }) => {

    const {
        playerData
    } = usePlayerData();

    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(`brawlbolt.com/?tag=${playerTag}`);
        setCopied(true);

        // Reset after 2 seconds (optional)
        setTimeout(() => setCopied(false), 5000);
    };

    return (
        <Card className="w-full max-w-5xl mb-8">

            {(typeof playerData[playerTag] !== "string") ? (
                <div className="text-center">
                    <CardHeader className="text-4xl font-bold">
                        {playerData[playerTag].playerInfo['name']}
                    </CardHeader>

                    <div className="flex justify-center">
                        <p className="text-sm text-gray-400 mx-2">{playerTag}</p>
                        <div className="relative group">
                            <div onClick={handleCopyClick} className="mx-2 w-6 h-6 cursor-pointer hover:text-blue-500">
                                {copied ? (
                                    <Check className="w-6 h-6 text-green-500" />
                                ) : (
                                    <Copy className="w-6 h-6" />
                                )}
                            </div>
                            {!copied && (
                                <span className="absolute left-10 -top-1/2 transform -translate-x-1 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                                    Copy profile link
                                </span>
                            )}
                        </div>
                    </div>
                </div>


            ) : (
                <CardHeader className="text-4xl font-bold justify-center">{playerTag}</CardHeader>
            )}


            {typeof playerData[playerTag] !== "string" ? (
                <div className="relative w-full mx-auto">
                    <Carousel className="w-full" opts={{ loop: true }}>
                        <CarouselContent>

                            <CarouselItem key="modeMapChart">
                                <RecursiveStatisticChart playerTag={playerTag} />
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

                        {
                            window.innerWidth >= 400 ? (
                                <div>
                                    <CarouselPrevious className="absolute top-1/2 transform -translate-y-1/2 z-10" />
                                    <CarouselNext className="absolute top-1/2 transform -translate-y-1/2 z-10" />
                                </div>
                            ) : (<div></div>)
                        }
                    </Carousel>

                    {/* {window.innerWidth < 400 ? ( */}
                    <CardFooter className="justify-center text-sm text-gray-500">Swipe to view more charts</CardFooter>
                    {/* ) : (<div></div>)} */}
                </div>
            ) : (
                <div className="flex flex-col space-y-3 p-4">
                    <Skeleton className="h-[125px] w-full rounded-xl justify-center">{playerData[playerTag]}</Skeleton>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            )}


        </Card>
    )

}