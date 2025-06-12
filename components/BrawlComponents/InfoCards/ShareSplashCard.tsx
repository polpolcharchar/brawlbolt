import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LinkCopyIndicator } from "../Selectors/LinkCopyIndicator";

const splashMessages = [
    //Share:
    "\"Tell your friends!\"",
    "\"Share with 3 friends or you will never reach legendary rank!\"",
    "\"Share = Unlock Leon!\"",
    "\"Share in your club chat!\"",
    "\"Help out your club: share TODAY!\"",
    "\"Help out your friends: share TODAY!\"",
    "\"Share if you hate Edgar!\"",
    "\"Tag a creator!\"",
    
    //Benefits
    "\"No ADs!",
    "\"Its FREE!",
    "\"Visit brawlbolt.com, select high winrate brawler, WIN!\"",
    "\"Don't just play the meta, KNOW the meta!\"",
    
    //Funny
    "\"Sharing this site statistically improves your winrate!\"",
    "\"Carbon Neutral!\"",
]

export const ShareSplashCard = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const randomMessage = splashMessages[Math.floor(Math.random() * splashMessages.length)];
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