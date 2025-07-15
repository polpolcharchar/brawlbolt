import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { TrieExplorerChart } from "../Charts/TrieExplorerChart";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertTriangle, LucideFrown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BrawlerOverTimeChart } from "../Charts/BrawlerOverTimeChart";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { LinkCopyIndicator } from "../Selectors/LinkCopyIndicator";


export const PlayerCardContent = ({ playerTag }: { playerTag: string }) => {

    const {
        playerData
    } = usePlayerData();

    return (
        <div>
            Player Card
            <div className="text-center">
                <CardHeader className="text-4xl font-bold">
                    {playerData[playerTag].name}
                </CardHeader>

                {/* Player tag and profile link */}
                {(playerTag !== "Global") && (
                    <div className="flex justify-center">
                        <p className="text-sm text-gray-400 mx-2">{playerTag}</p>
                        <LinkCopyIndicator url={`brawlbolt.com/?tag=${playerTag}`} title="Copy profile link" />
                    </div>
                )}

            </div>

            <div className="relative w-full mx-auto">
                <TrieExplorerChart playerTag={playerTag} />
            </div>
        </div>
    )

}