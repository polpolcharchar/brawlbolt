import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerSelector } from "../Selectors/PlayerSelector";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { finalizeVerification, initiateVerification, verifyStep } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { getBrawlerNameFromIconID } from "@/lib/BrawlUtility/BrawlConstants";


export const VerificationCard = () => {

    const { activePlayerTag } = usePlayerData();

    const [verificationStage, setVerificationState] = useState("initial");
    const [tagToVerify, setTagToVerify] = useState("");

    const [verificationToken, setVerificationToken] = useState("");
    const [iconID, setIconID] = useState(-1);
    const [verificationStepsRemaining, setVerificationStepsRemaining] = useState(-1);

    const [waitingSeconds, setWaitingSeconds] = useState(60);

    const [inputPassword, setInputPassword] = useState("");
    const handlePasswordSubmit = () => {
        finalizeVerification(tagToVerify, verificationToken, inputPassword, (success: boolean) => {
            setVerificationState("complete");
        });
    }

    useEffect(() => {
        if (verificationStage === "waiting" && waitingSeconds > 0) {
            const timer = setTimeout(() => {
                setWaitingSeconds(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (verificationStage === "waiting" && waitingSeconds === 0) {
            verifyStep(tagToVerify, verificationToken,
                (success: boolean, readyForPassword?: boolean, verificationsRemaining?: number, iconID?: number) => {

                    if (!success) {
                        console.log("Verify Step Error!");
                    } else if (readyForPassword) {
                        setVerificationState("passwordEntry");
                    } else if (!verificationsRemaining || !iconID) {
                        console.log("Unexpected state!");
                    } else {
                        setVerificationState("verifyStep");
                        setIconID(iconID);
                        setVerificationStepsRemaining(verificationsRemaining);
                    }
                });
        }
    }, [verificationStage, waitingSeconds]);

    return (
        <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">
            {/* Player Stats Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Verify Account</CardTitle>
                    <CardDescription>This process will take around 5 minutes</CardDescription>
                </CardHeader>

                {verificationStage == "initial" && (
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <p className="text-lg font-bold">
                                You are verifying:
                            </p>
                            <PlayerSelector />
                        </div>

                        <Button onClick={() => {
                            setTagToVerify(activePlayerTag);
                            initiateVerification(activePlayerTag, (success: boolean, token?: string, iconID?: number) => {
                                if (!success || !token || !iconID) {
                                    console.log("Initialization Error");
                                    return;
                                }

                                setVerificationState("verifyStep");
                                setVerificationToken(token);
                                setIconID(iconID);
                            })
                        }} disabled={!activePlayerTag} className="text-gray-200">
                            GO!
                        </Button>

                    </CardContent>
                )}

                {verificationStage == "verifyStep" && (
                    <CardContent className="flex flex-col gap-4">

                        <div className="block gap-4 items-center">

                            {verificationStepsRemaining != -1 && (
                                <p className="text-sm text-gray-500">
                                    Success! Full verification requires multiple attempts. {verificationStepsRemaining} more verification(s) needed.
                                </p>
                            )}

                            <p className="text-lg">
                                Switch your player icon to the default <b>{getBrawlerNameFromIconID(iconID)}</b> image.
                            </p>

                            <div className="flex gap-4 items-center">
                                <p className="text-lg">
                                    It should looke like this:
                                </p>

                                <img
                                    src={`/brawlerIcons/${getBrawlerNameFromIconID(iconID)}.png`}
                                    alt={`${getBrawlerNameFromIconID(iconID)} icon`}
                                    className="h-12 w-auto rounded-md border-[3px] border-(--primary)"
                                />
                            </div>

                        </div>

                        <Button onClick={() => {
                            setVerificationState("waiting");
                            setWaitingSeconds(60);
                        }} className="text-gray-200">
                            Click here once it is changed
                        </Button>
                    </CardContent>

                )}

                {verificationStage === "waiting" && (
                    <CardContent className="flex flex-col gap-4">

                        {verificationStepsRemaining != -1 && (
                            <p className="text-sm text-gray-500">
                                Success! Full verification requires multiple attempts. {verificationStepsRemaining} more verification(s) needed.
                            </p>
                        )}

                        <p className="text-lg font-bold">
                            Waiting {waitingSeconds} second{waitingSeconds !== 1 ? "s" : ""} for the API to update...
                        </p>

                        <div className="w-full h-4 bg-gray-300 rounded">
                            <div
                                className="h-full bg-blue-500 rounded"
                                style={{ width: `${((60 - waitingSeconds) / 60) * 100}%` }}
                            />
                        </div>

                        {waitingSeconds === 0 && (
                            <p className="text-green-600 font-semibold">
                                Done! Checking profile...
                            </p>
                        )}
                    </CardContent>
                )}

                {verificationStage === "passwordEntry" && (
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-lg font-bold">
                            Success! Enter a password:
                        </p>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            className="px-4 py-2 border border-gray-400 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={handlePasswordSubmit} className="text-gray-200">
                            Submit
                        </Button>
                    </CardContent>
                )}

                {verificationStage == "complete" && (
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <p className="text-lg font-bold">
                                Success! {tagToVerify} has been verified and your password has been saved.
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}