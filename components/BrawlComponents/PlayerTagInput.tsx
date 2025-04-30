"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useState } from "react";

export const PlayerTagInput = () => {
    const [playerTag, setPlayerTag] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        updatePlayerData
    } = usePlayerData();

    const handleSearch = async (e: any, tagToHandle: string = playerTag) => {

        // const tagToHandle = "";

        setIsLoading(true);

        updatePlayerData(tagToHandle, "Loading...");

        try {
            const response = await fetch("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "getPlayerData", "playerTag": tagToHandle }),
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

        } finally {
            setIsLoading(false);
            setPlayerTag("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            handleSearch(null);
        }
    };

    return (

        <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Input
                    placeholder="Enter player tag"
                    value={playerTag}
                    onChange={(e) => setPlayerTag(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="max-w-[200px] w-full"
                />
                <Button onClick={handleSearch} disabled={!playerTag || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Submit
                </Button>
            </div>
            <Button
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                    handleSearch(null, "GJCLVRQLG");
                }}
            >
                Load Example Profile
            </Button>
        </div>

    );
};
