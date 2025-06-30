"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGlobalStats, handlePlayerSearch } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { isValidTag } from "@/lib/BrawlUtility/BrawlConstants";
import { Card, CardContent } from "../ui/card";

export const PlayerTagInput = () => {
    const [playerTag, setPlayerTag] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { updatePlayerData } = usePlayerData();

    //Handle Initial Global Stats:
    useEffect(() => {
        fetchGlobalStats(setIsLoading, updatePlayerData);
    }, [])

    //Submit
    const submitPlayerTag = async () => {
        await handlePlayerSearch(playerTag, setIsLoading, updatePlayerData);
        setPlayerTag("");
    }

    //Enter handling
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading && isValidTag(playerTag)) {
            submitPlayerTag();
        }
    };

    //Uppercase, replace O with 0
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTag = e.target.value.toUpperCase().replace(/O/g, '0');
        setPlayerTag(newTag);
    };

    return (
        // <div className="flex items-center justify-center p-2">
        //     <Card className="bg-red-100 border-red-500 text-red-800 max-w-lg">
        //         <CardContent className="text-center py-6">
        //             <h1 className="text-2xl font-bold">Sorry, player accounts are down for maintenance.</h1>
        //             <p className="mt-2">Check back soon.</p>
        //         </CardContent>
        //     </Card>
        // </div>
            <div className="flex flex-col items-center mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Input
                        placeholder="Enter player tag"
                        value={playerTag}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="max-w-[200px] w-full"
                        name="playerTagInput"
                    />
                    <div title="Tags can only contain {0, 2, 8, 9, C, G, J, L, P, Q, R, U, V, Y, #} and cannot be shorter than 3 characters">
                        <Button
                            onClick={() => submitPlayerTag()}
                            disabled={!isValidTag(playerTag) || isLoading}
                            className={`text-white ${(!isValidTag(playerTag) && playerTag != "") ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {(!isValidTag(playerTag) && playerTag != "") ? "Invalid Tag" : "Submit"}
                        </Button>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="text-white bg-blue-600 hover:bg-blue-700">Player Tag?</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-gray-200">Brawl Stars Player Tags</DialogTitle>
                            </DialogHeader>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-200">What is mine?</h3>
                                <p className="text-gray-400 mb-2">
                                    {"Your (or any friend's) player tag can be found on any in-game account page, under the profile picture. It begins with a #."}
                                </p>

                                <h3 className="text-xl font-semibold text-gray-200">What is a player tag?</h3>
                                <p className="text-gray-400 mb-2">
                                    Every Brawl Stars account has a unique identifier that is used by the API.
                                    This is NOT your username.
                                </p>
                            </div>

                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <>
                        <style>{`
            @keyframes pulseGrowShrink {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .animated-button {
              animation: pulseGrowShrink 2s infinite;
              color: white
            }
          `}</style>
                        <Button
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white animated-button"
                            onClick={() => {
                                handlePlayerSearch("GJCLVRQLG", setIsLoading, updatePlayerData);
                            }}
                        >
                            Load Example Profile
                        </Button>
                    </>

                </div>

            </div >
    );
};