import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ScarceDataAlertCard = () => {
    return (
        <div className="flex flex-col items-center">
            <Card className="bg-yellow-100 border-yellow-400 shadow-md p-4 rounded-2xl flex items-center w-full max-w-xl  text-center">
                <AlertTriangle className="text-yellow-600 w-6 h-6 mr-3" />
                <CardContent>
                    <p className="text-yellow-800 font-medium">
                        Newly-tracked accounts only have 25 saved games!
                        Once BrawlBolt tracking begins, every game is saved.
                        Keep playing and check back for increased stat accuracy!
                    </p>
                    <p className="text-yellow-800 font-medium">
                        Compiled statistics may take up to 48 hours to update!
                    </p>
                </CardContent>
            </Card>

        </div>
    );
};

export default ScarceDataAlertCard;
