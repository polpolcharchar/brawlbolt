import { isValidTag } from "./BrawlConstants";

const requestServer = async (body: string, setIsLoading: (value: boolean) => void) => {

    setIsLoading(true);

    try{
        const response = await fetch("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if(response.ok){
            const result = await response.text();
            return result;
        }else{
            return false;
        }

    }catch (error) {
        return false;
    }finally {
        setIsLoading(false);
    }
}

export const handlePlayerSearch = async (tagToHandle: string, setIsLoading: (value: boolean) => void, updatePlayerData: (playerTag: string, playerD: any) => void) => {
    //Manage tag
    if (!isValidTag(tagToHandle)) return false;

    if (tagToHandle.substring(0, 1) == "#") {
        tagToHandle = tagToHandle.substring(1);
    }
    
    //Add loading card
    updatePlayerData(tagToHandle, "Loading...");

    //Get initial data:
    const initialRequestBody = JSON.stringify({ type: "getBaseRegularModeMapBrawler", playerTag: tagToHandle});
    const initialRequestResult = await requestServer(initialRequestBody, setIsLoading);
    if(initialRequestResult){
        const playerData = {"initialRegularModeMapBrawler": JSON.parse(initialRequestResult)}
        updatePlayerData(tagToHandle, playerData);
    }else{
        console.log("No initial");
    }

    //Request and update
    const body = JSON.stringify({ type: "getPlayerData", playerTag: tagToHandle });
    const requestResult = await requestServer(body, setIsLoading);
    if(requestResult){
        updatePlayerData(tagToHandle, JSON.parse(requestResult));
    }else{
        updatePlayerData(tagToHandle, "Player not found");
    }
};

export const fetchGlobalStats = async (setIsLoading: (value: boolean) => void, updatePlayerData: (playerTag: string, playerD: any) => void) => {

    updatePlayerData("Global", "Loading...");
    
    const body = JSON.stringify({type: "getGlobalStats"});
    const requestResult = await requestServer(body, setIsLoading);
    if(requestResult){
        const mockData = {
            playerInfo: {
                name: "Global Statistics"
            },
            playerStats: JSON.parse(requestResult)
        }
        updatePlayerData("Global", mockData);
    }else{
        updatePlayerData("Global", "Error fetching global data.");
    }
}