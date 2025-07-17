import { Card } from "../../ui/card";
import { GlobalCardContent } from "./GlobalCardContent";
import { PlayerCardContent } from "./PlayerCardContent";

export const StatisticCard = ({ playerTag }: { playerTag: string }) => {

    return (
        <Card className="w-full max-w-5xl mb-8 border-blue-700 border-2">
            {(playerTag === "global") ? (
                <GlobalCardContent />
            ) : (
                <PlayerCardContent playerTag={playerTag} />
            )}
        </Card >
    )
}