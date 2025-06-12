"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";

function isValidTag(tag: string): boolean {
    // Define the set of valid characters
    const validChars = new Set(['P', 'Y', 'L', 'Q', 'G', 'R', 'J', 'C', 'U', 'V', '0', '2', '8', '9', '#']);

    // Check if the tag contains only valid characters
    for (let char of tag.toUpperCase()) {
        if (!validChars.has(char)) {
            return false;
        }
    }

    // Ensure the tag has at least 3 characters (the shortest valid tag found)
    if (tag.length < 3) {
        return false;
    }

    return true;
}

export const PlayerTagInput = () => {
    const [playerTag, setPlayerTag] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { updatePlayerData } = usePlayerData();

    useEffect(() => {
        if (!isLoading) {
            fetchGlobalStats();
        }
    }, [])
    const fetchGlobalStats = async () => {
        setIsLoading(true);

        updatePlayerData("Global", "Loading...");

        try {
            const response = await fetch("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "getGlobalStats" }),
            });

            if (response.status === 200) {
                const body = await response.text();

                const mockData = {
                    playerInfo: {
                        name: "Global Statistics (NEW!)"
                    },
                    playerStats: JSON.parse(body)
                }

                updatePlayerData("Global", mockData);
            } else {
                updatePlayerData("Global", "Server Error fetching global data");
            }

        } catch (error) {
            console.error(error);
            updatePlayerData("Global", "Error fetching global data")
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = async (e: any, tagToHandle: string = playerTag) => {
        if (!isValidTag(tagToHandle)) return;

        if (tagToHandle.substring(0, 1) == "#") {
            tagToHandle = tagToHandle.substring(1);
        }

        setIsLoading(true);

        updatePlayerData(tagToHandle, "Loading...");

        try {
            const response = await fetch("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "getPlayerData", playerTag: tagToHandle }),
            });

            if (response.status === 502) {
                updatePlayerData(tagToHandle, "Player not found, initiate tracking above");
            } else if (response.status === 200) {
                const body = await response.text();
                updatePlayerData(tagToHandle, JSON.parse(body));
            } else {
                updatePlayerData(tagToHandle, "Player not found, initiate tracking above");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setPlayerTag("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading && isValidTag(playerTag)) {
            handleSearch(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTag = e.target.value.toUpperCase().replace(/O/g, '0');
        setPlayerTag(newTag);
    };

    return (
        <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Input
                    placeholder="Enter player tag"
                    value={playerTag}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="max-w-[200px] w-full"
                />
                <div title="Tags can only contain {0, 2, 8, 9, C, G, J, L, P, Q, R, U, V, Y, #} and cannot be shorter than 3 characters">
                    <Button
                        onClick={handleSearch}
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
                            handleSearch(null, "GJCLVRQLG");
                        }}
                    >
                        Load Example Profile
                    </Button>
                </>

            </div>

        </div >
    );
};