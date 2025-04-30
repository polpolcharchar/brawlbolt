"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function isValidTag(tag: string): boolean {
    // Define the set of valid characters
    const validChars = new Set(['P', 'Y', 'L', 'Q', 'G', 'R', 'J', 'C', 'U', 'V', '0', '2', '8', '9']);

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

async function sendApiRequest(url: string, body: any) {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    const response = await fetch(url, options);

    const data = await response.json();

    data.ok = response.ok;

    return data;
}


const Page = () => {
    const [tag, setTag] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (): Promise<boolean> => {

        setLoading(true);

        let requestTag = tag;
        if (requestTag.startsWith('#')) {
            requestTag = requestTag.substring(1);
        }
        // Validate the tag
        if (!isValidTag(requestTag)) { // Exclude the '#' when validating
            setError("Invalid Tag!");
            setLoading(false);
            return false;
        }

        let result = await sendApiRequest("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython",
            {
                "type": "addTag",
                "playerTag": requestTag
            }
        )

        setTag('');
        setLoading(false);

        if (!result.ok) {

            if(result.message === "Player already tracked"){
                router.push("/?tag=" + requestTag);
            }

            setError("Error: " + result.message);
            return false;
        } else {
            setError(null);

            // console.log("ok!");

            // toast("Tag submitted for tracking!", {
            //     description: tag + " will begin accumulating data!",
            //     action: {
            //         label: "Dismiss",
            //         onClick: () => { },
            //     },
            // });

            router.push("/?tag=" + requestTag);

            return true;
        }
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value.toUpperCase());

        if (error) {
            setError(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) {
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Card className="max-w-xl w-full shadow-lg rounded-2xl">
                <CardContent className="p-6">
                    <h1 className="text-6xl font-bold text-center mb-4">
                        Begin Tracking Your Account NOW
                    </h1>
                    <Input
                        value={tag}
                        onChange={handleTagChange} // Use handleTagChange to enforce uppercase
                        placeholder="Enter your player tag"
                        className="w-full mb-4 text-center"
                        disabled={loading}
                        onKeyDown={handleKeyDown}
                    />
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>} {/* Display error message */}
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                        onClick={
                            handleSubmit
                        }
                    >
                        Submit
                    </Button>
                    <ul className="mt-6 list-[circle] list-inside text-3xl font-bold text-center">
                        <li>Save your games</li>
                        <li>Get personalized insights</li>
                        <li>Analyze your playstyle</li>
                    </ul>
                </CardContent>

                <CardFooter className="p-4 text-sm text-gray-600 text-center block">
                    <p>
                        By submitting, you grant us permission to track this account's games and handle the data as deemed appropriate.
                        This includes but is not limited to data analysis and publically-accessible statistics.
                        Only <b>game-related</b> data is collected; for specifics, see the{" "}
                        <a
                            href="https://developer.brawlstars.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            Brawl Stars API
                        </a>
                        .
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;
