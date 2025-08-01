import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBrawlerNameFromIconID } from "@/lib/BrawlUtility/BrawlConstants";
import { finalizeVerification, initiateVerification, verifyStep } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { ArrowRight, Frown } from "lucide-react";
import { useEffect, useState } from "react";
import { PlayerSelector } from "../Selectors/PlayerSelector";


export const VerificationCard = () => {

    const { activePlayerTag, playerData, updatePlayerData } = usePlayerData();

    const [message, setMessage] = useState("");

    const [verificationStage, setVerificationState] = useState("initial");
    const [tagToVerify, setTagToVerify] = useState("");

    const [verificationToken, setVerificationToken] = useState("");
    const [iconID, setIconID] = useState(-1);
    const [verificationStepsRemaining, setVerificationStepsRemaining] = useState(-1);

    const [waitingSeconds, setWaitingSeconds] = useState(0);

    const [inputPassword, setInputPassword] = useState("");
    const handlePasswordSubmit = () => {
        finalizeVerification(tagToVerify, verificationToken, inputPassword, (success: boolean) => {
            if (success) {
                updatePlayerData(tagToVerify, playerData[tagToVerify]["name"], "", true);
                setVerificationState("complete");
            } else {
                setVerificationState("tryLater");
            }
        });
    }

    // Handle Countdown
    useEffect(() => {
        if (verificationStage === "waiting" && waitingSeconds % 15 === 0) {
            verifyStep(tagToVerify, verificationToken,
                (success: boolean, message: string, readyForPassword?: boolean, verificationsRemaining?: number, iconID?: number) => {
                    if (waitingSeconds == 0) {
                        if (!success) {
                            setVerificationState("verifyStep");
                            setMessage(message);
                        } else if (readyForPassword) {
                            setVerificationState("passwordEntry");
                        } else if (!verificationsRemaining || !iconID) {
                            console.log("Unexpected state!");
                        } else {
                            setVerificationState("verifyStep");
                            setIconID(iconID);
                            setVerificationStepsRemaining(verificationsRemaining);
                        }
                    } else {

                        //Only care about successes here. If not successful, we will keep trying until 0 seconds
                        if (success && readyForPassword) {
                            setVerificationState("passwordEntry");
                        } else if (success && iconID && verificationsRemaining) {
                            setVerificationState("verifyStep");
                            setIconID(iconID);
                            setVerificationStepsRemaining(verificationsRemaining);
                        }
                    }

                });
        }

        if (verificationStage === "waiting" && waitingSeconds > 0) {
            const timer = setTimeout(() => {
                setWaitingSeconds(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [verificationStage, waitingSeconds]);

    return (
        <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">
            <Card className="shadow-lg text-(--foreground)">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {tagToVerify ? `Verifying ${tagToVerify}` : 'Verify Account'}
                    </CardTitle>
                </CardHeader>

                {verificationStage == "initial" && (
                    <CardContent className="flex flex-col gap-2">

                        <CardDescription>
                            {"To prove you own an account, you simply have to change the account's icon a few times. "}
                            {"This change can be reverted as soon as verification is finished."}<br />
                            {"This process will take around 3 minutes. "}<br />
                            {"When complete, you will set a BrawlBolt password that can be used for faster verification in the future. "}
                        </CardDescription>

                        <div className="flex gap-4">
                            <p className="text-lg">
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
                        }} disabled={!activePlayerTag} className="text-(--foreground)">
                            GO!
                        </Button>

                    </CardContent>
                )}

                {verificationStage == "verifyStep" && (
                    <CardContent className="flex flex-col gap-4">

                        <div className="block gap-4 items-center">

                            {message && (
                                <p className="text-md text-red-500">
                                    Looks like an error occurred: "{message}." Please try again.
                                </p>
                            )}

                            {verificationStepsRemaining != -1 && (
                                <p className="text-sm text-(--muted-foreground)">
                                    Full verification requires multiple attempts. {verificationStepsRemaining} more verification(s) needed.
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
                            setMessage("");
                        }} className="text-(--foreground)">
                            Click here once it is changed
                        </Button>
                    </CardContent>

                )}

                {verificationStage === "waiting" && (
                    <CardContent className="flex flex-col gap-4">

                        {verificationStepsRemaining != -1 && (
                            <p className="text-sm text-(--muted-foreground)">
                                Full verification requires multiple attempts. {verificationStepsRemaining} more verification(s) needed.
                            </p>
                        )}

                        <p className="text-lg font-bold">
                            Waiting {waitingSeconds} second{waitingSeconds !== 1 ? "s" : ""} for Brawl Stars' servers...
                        </p>

                        <div className="w-full h-4 bg-gray-300 rounded">
                            <div
                                className="h-full bg-(--primary) rounded"
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

                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            className="px-4 py-2 border border-gray-400 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") {
                                    handlePasswordSubmit();
                                }
                            }}
                        />
                        <Button onClick={handlePasswordSubmit} className="text-(--foreground)">
                            Submit
                        </Button>
                    </CardContent>
                )}

                {verificationStage == "complete" && (
                    <CardDescription className="mx-4 text-lg flex flex-col gap-2">
                        {`Success! ${tagToVerify} has been verified and your password has been saved. `}
                        {`You can now log in by providing your account's password in the account selector.`}
                        <div className="flex items-center gap-2">
                            <ArrowRight />
                            <PlayerSelector />
                        </div>
                        <Button className="text-(--foreground)" onClick={() => setVerificationState("initial")}>
                            Verify another account
                        </Button>
                    </CardDescription>
                )}

                {verificationStage == "tryLater" && (
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex gap-4 text-red-500">
                            <Frown />
                            <p className="text-lg font-bold">
                                An unexpected error has occurred. Please try again later.
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}