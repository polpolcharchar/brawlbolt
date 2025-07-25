import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerSelector } from "../Selectors/PlayerSelector";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { initiateVerification } from "@/lib/BrawlUtility/BrawlDataFetcher";


export const VerificationCard = () => {

    const {activePlayerTag} = usePlayerData();

    const [verificationStage, setVerificationState] = useState("initial");
    const [tagToVerify, setTagToVerify] = useState("");

    const [verificationToken, setVerificationToken] = useState("");
    const [iconID, setIconID] = useState(-1);

    if (verificationStage == "initial") {
        return (
            <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">
                {/* Player Stats Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Verify Account</CardTitle>
                        <CardDescription>This process will take around 5 minutes</CardDescription>
                    </CardHeader>
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
                                if(!success || !token || !iconID){
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
                </Card>
            </div>
        );
    } else {
        return (
            "Error"
        )
    }

}