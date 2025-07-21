import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"

export function MatchCard({ match }: { match: any }) {
    const { battleTime, event, battle } = match

    const formatDuration = (sec: number) => {
        const minutes = Math.floor(sec / 60)
        const seconds = sec % 60
        return `${minutes}m ${seconds}s`
    }

    const teamCards = (team: any[], isRight: boolean = false) =>
        team.map((player, idx) => (
            <div
                key={idx}
                className="flex flex-colitems-center text-center"
            >
                <div className="mt-1">
                    <span className="text-white text-lg font-bold">{player.name}</span>
                    <br />
                    <span className="text-md">{player.brawler.name}</span>
                    <br />
                    <span className="text-yellow-400 text-sm">{player.brawler.trophies}🏆</span>
                </div>
            </div>
        ))

    return (
        <Card className="border-none shadow-md w-full max-w-4xl mx-auto my-2 gap-0">
            <CardHeader className="flex flex-row justify-between items-center px-4">
                <div>
                    <div className="font-bold text-lg">BRAWL BALL</div>
                    <div className="text-sm text-blue-300">{event.map}</div>
                </div>
                <div className="text-center">
                    <div className="text-red-500 font-bold text-xl uppercase">{battle.result}</div>
                    <div className="text-yellow-400 font-bold text-lg">{battle.trophyChange}🏆</div>
                </div>
                <div className="text-sm text-gray-300">{formatDuration(battle.duration)}</div>
            </CardHeader>

            <CardContent className="flex justify-between items-center px-4">
                <div className="flex gap-3">{teamCards(battle.teams[0])}</div>

                <div className="text-2xl font-bold">VS</div>

                <div className="flex gap-3">{teamCards(battle.teams[1], true)}</div>
            </CardContent>
        </Card>
    )
}
