import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { formatDate } from "./MatchTable";
import { getMode } from "@/lib/BrawlUtility/BrawlConstants";

export function getFormattedResultAndTrophyChange(battle: any) {
    function getResultFromTrophyChange(n: number): string {
        if (n > 0) return "Victory";

        if (n === 0) return "Draw";

        return "Defeat";
    }

    if (battle.rank) {
        return getResultFromTrophyChange(battle.trophyChange || 0) + ": " + (battle.trophyChange || 0);
    }


    if (battle.result) {
        return battle.result.replace(/\b\w/g, (char: any) => char.toUpperCase()) + (battle.trophyChange ? ": " + battle.trophyChange : "");
    }

    if (battle.trophyChange) {
        if (battle.trophyChange > 0) {
            return "Victory: +" + battle.trophyChange;
        } else if (battle.trophyChange === 0) {
            return "Draw: 0";
        } else {
            return "Defeat: " + battle.trophyChange;
        }
    }

    return "Draw?";
}
function getBrawlers(player: any): any[] {
    if (player.brawler) return [player.brawler];

    return player.brawlers;
}
function getBrawlerTrophyDisplayString(player: any): string {
    return getBrawlers(player).map((brawler) => brawler.name + " - " + brawler.trophies).join(", ");
}
export function getAverageTrophies(battle: any){
    function getPlayers(battle: any){
        if(battle.players)return battle.players;
        return battle.teams.flat();
    }

    let sum = 0;
    let total = 0;

    for (const player of getPlayers(battle)) for (const brawler of getBrawlers(player)) {
            sum += brawler.trophies;
            total++;
        }

        return sum / total;
}

export const MatchInfoDialog = ({ battleData, setCurrentBattle }: { battleData: any | null, setCurrentBattle: (value: any | null) => void }) => {
    return (
        <Dialog open={battleData !== null} onOpenChange={(open) => !open && setCurrentBattle(null)}>
            {battleData && (
                <DialogContent className="!max-w-2xl max-h-[calc(100vh-50px)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Battle Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-medium">{formatDate(battleData.battleTime)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Mode</p>
                                <p className="font-medium capitalize">{getMode(battleData)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Map</p>
                                <p className="font-medium">{battleData.event.map}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Result</p>
                                {getFormattedResultAndTrophyChange(battleData.battle)}
                            </div>

                            {battleData.battle.rank && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Rank</p>
                                    <p className="font-medium">{battleData.battle.rank}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Players</h3>
                            {battleData.battle.teams ? (
                                // Team mode
                                <div className="grid grid-cols-2 gap-4">
                                    {battleData.battle.teams.map((team: any, teamIndex: any) => (
                                        <div key={teamIndex} className="space-y-2">
                                            <h4 className="font-medium">Team {teamIndex + 1}</h4>
                                            <div className="space-y-2">
                                                {team.map((player: any, playerIndex: any) => (
                                                    <div
                                                        key={playerIndex}
                                                        className={`p-2 rounded-md bg-muted/50 flex items-center justify-between ${battleData.battle.starPlayer?.tag === player.tag ? "ring-2 ring-yellow-400" : ""
                                                            }`}
                                                    >
                                                        <div>
                                                            <p className="font-medium">{player.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {getBrawlerTrophyDisplayString(player)} 🏆
                                                            </p>
                                                        </div>
                                                        {battleData.battle.starPlayer?.tag === player.tag && (
                                                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : battleData.battle.players ? (
                                // Solo mode
                                <div className="grid gap-2">
                                    {battleData.battle.players.map((player: any, index: any) => (
                                        <div
                                            key={index}
                                            className={`p-2 rounded-md bg-muted/50 flex items-center justify-between ${battleData.battle.starPlayer?.tag === player.tag ? "ring-2 ring-yellow-400" : ""
                                                }`}
                                        >
                                            <div>
                                                <p className="font-medium">{player.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {getBrawlerTrophyDisplayString(player)} 🏆
                                                </p>
                                            </div>
                                            {battleData.battle.starPlayer?.tag === player.tag && (
                                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <DialogDescription>
                        {formatDate(battleData.battleTime)}
                    </DialogDescription>

                </DialogContent>
            )}
        </Dialog>
    );
}