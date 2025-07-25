import { isValidTag } from "./BrawlConstants";

const requestServer = async (body: string, setIsLoading: (value: boolean) => void) => {

    setIsLoading(true);

    try {
        const response = await fetch("https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if (response.ok) {
            const result = await response.text();
            return result;
        } else {
            return false;
        }

    } catch (error) {
        return false;
    } finally {
        setIsLoading(false);
    }
}

export const handlePlayerSearch = async (tagToHandle: string, setIsLoading: (value: boolean) => void, updatePlayerData: (playerTag: string, playerD: any) => void) => {

    setIsLoading(true);

    //Manage tag
    if (!isValidTag(tagToHandle)) return false;

    if (tagToHandle.substring(0, 1) == "#") {
        tagToHandle = tagToHandle.substring(1);
    }

    updatePlayerData(tagToHandle, tagToHandle);

    // Get info
    const playerInfo = await getPlayerInfo(tagToHandle);
    if (!playerInfo) {
        updatePlayerData(tagToHandle, "Player not found");
        setIsLoading(false);
        return false;
    }

    //Add name:
    updatePlayerData(tagToHandle, playerInfo['playerInfo']['name']);

    setIsLoading(false);

    return true;
};

export const getPlayerInfo = async (playerTag: string) => {
    const requestBody = JSON.stringify({ type: "getPlayerInfo", playerTag });

    const requestResult = await requestServer(requestBody, () => { });

    if (requestResult) {
        return JSON.parse(requestResult);
    } else {
        console.error("Failed to fetch player info");
        return null;
    }
}

export const fetchTrieData = async (
    requestType: string,
    requestMode: string,
    requestMap: string,
    requestBrawler: string,
    targetAttribute: string,
    playerTag: string,
    filterID: string,
    isGlobal: boolean,
    setIsLoading: (value: boolean) => void
) => {

    let requestBody: any = {
        type: "getTrieData",
        playerTag,
        filterID,
        targetAttribute,
        isGlobal,
    }
    if (requestType != "") {
        requestBody["requestType"] = requestType;
    }
    if (requestMode != "") {
        requestBody["requestMode"] = requestMode;
    }
    if (requestMap != "") {
        requestBody["requestMap"] = requestMap;
    }
    if (requestBrawler != "") {
        requestBody["requestBrawler"] = requestBrawler;
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), setIsLoading);
    return requestResult;

}

export const fetchGlobalStats = async (numItems: number, requestType: string, requestMode: string, requestBrawler: string, targetAttribute: string) => {

    let requestBody: any = {
        "type": "getRecentTrieData",
        "playerTag": "global",
        "numItems": numItems,
        "isGlobal": true,
    }

    if (requestType != "") {
        requestBody["requestType"] = requestType;
    }
    if (requestMode != "") {
        requestBody["requestMode"] = requestMode;
    }
    if (requestBrawler != "") {
        requestBody["requestBrawler"] = requestBrawler;
    }
    if (targetAttribute != "") {
        requestBody["targetAttribute"] = targetAttribute;
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), () => { });

    if (requestResult) {
        return requestResult;
    } else {
        console.error("Failed to fetch global stats");
        return null;
    }
}

export const fetchGlobalScanInfo = async () => {
    const requestBody = {
        "type": "getRecentGlobalScanInfo"
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), () => { });

    if (requestResult) {
        return requestResult;
    } else {
        return null;
    }

}

export const fetchMatches = async (playerTag: string, datetime: string, numBefore: number, numAfter: number, setIsLoading: (v: boolean) => void) => {

    const requestBody = {
        "type": "queryGames",
        "playerTag": playerTag,
        "datetime": datetime,
        "numBefore": numBefore,
        "numAfter": numAfter
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), setIsLoading);

    if (requestResult) {
        return requestResult;
    } else {
        return null;
    }

}

export const initiateVerification = async (playerTag: string, callback: (success: boolean, token?: string, iconID?: number) => void) => {
    const requestBody = {
        "type": "verifyAccount",
        "playerTag": playerTag,
        "verificationRequestType": "initiate"
    }

    const result = await requestServer(JSON.stringify(requestBody), () => {});
    
    if(!result){
        callback(false)
        return false
    }

    const parsedResult = JSON.parse(result);

    if("error" in parsedResult){
        callback(false)
        return false
    }

    callback(true, parsedResult["token"], parsedResult["iconIdToSet"]);
    return true;
}