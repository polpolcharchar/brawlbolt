import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LinkCopyIndicator } from "../LinkCopyIndicator";

const messages = [
    "Tell your friends!",
    "Share with 3 friends or you will never reach legendary rank!",
    "Share = Unlock Leon!",
    "Sharing this site statistically improves your winrate!",
    "Share in your club chat!",
    "Help out your club: share today!",
    "Visit brawlbolt.com, select high winrate brawler, WIN!",
    "Share if you hate Edgar!",
]

export const ShareSplashCard = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMessage);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <Card className="border-green-400 shadow-md p-4 rounded-2xl flex items-center w-full max-w-md mt-4 text-center">
                <CardTitle className="text-2xl font-bold mb-0 text-green-600">
                    Check back for regular updates!
                </CardTitle>
                <div className="flex">
                    <LinkCopyIndicator url="brawlbolt.com" title="Copy Link" copyClassName="w-6 h-6 text-green-400" pulseAnimation={true}/>
                    <CardContent>
                        <p className="text-green-600 font-medium">
                            {message}
                        </p>
                    </CardContent>
                    <LinkCopyIndicator url="brawlbolt.com" title="Copy Link" copyClassName="w-6 h-6 text-green-400" pulseAnimation={true}/>

                </div>
            </Card>
        </div >
    );
}