import { setBrawlerModeLabelsUpdateAttempted, isValidTag, brawlerModeLabelsUpdateAttempted, brawlerLabels, setBrawlerLabels, setModeLabels } from "./BrawlConstants";

const requestServer = async (body: string, setIsLoading: (value: boolean) => void) => {

    setIsLoading(true);

    try {
        const response = await fetch("https://api.brawlbolt.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });

        if (response.ok) {
            const result = await response.json();
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

export const handlePlayerSearch = async (tagToHandle: string, setIsLoading: (value: boolean) => void, updatePlayerData: (playerTag: string, playerName: any, token: string, verified: boolean) => void) => {

    setIsLoading(true);

    //Manage tag
    if (!isValidTag(tagToHandle)) return false;

    if (tagToHandle.substring(0, 1) == "#") {
        tagToHandle = tagToHandle.substring(1);
    }

    updatePlayerData(tagToHandle, tagToHandle, "", false);

    // Get info
    const playerInfo = await getPlayerInfo(tagToHandle);
    if (!playerInfo || !playerInfo["playerInfo"]) {
        updatePlayerData(tagToHandle, "Player not found", "", false);
        setIsLoading(false);
        return false;
    }

    //Add name:
    updatePlayerData(tagToHandle, playerInfo['playerInfo']['name'], "", playerInfo['verified']);

    setIsLoading(false);

    return true;
};

export const getPlayerInfo = async (playerTag: string) => {
    const requestBody = JSON.stringify({ type: "getPlayerInfo", playerTag });

    const requestResult = await requestServer(requestBody, () => { });

    if (requestResult) {
        return requestResult;
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

export const fetchMatches = async (playerTag: string, datetime: string, numBefore: number, numAfter: number, setIsLoading: (v: boolean) => void, accountToken: string) => {
    setIsLoading(true);

    const requestBody = {
        "type": "queryGames",
        "playerTag": playerTag,
        "datetime": datetime,
        "numBefore": numBefore,
        "numAfter": numAfter,
        "token": accountToken
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), setIsLoading);
    setIsLoading(false);

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

    const result = await requestServer(JSON.stringify(requestBody), () => { });

    if (!result) {
        callback(false)
        return false
    }

    if ("error" in result) {
        callback(false)
        return false
    }

    callback(true, result["token"], result["iconIdToSet"]);
    return true;
}

export const verifyStep = async (playerTag: string, token: string, callback: (success: boolean, message: string, readyForPassword?: boolean, verificationsRemaining?: number, iconID?: number) => void) => {
    const requestBody = {
        "type": "verifyAccount",
        "verificationRequestType": "verifyStep",
        "playerTag": playerTag,
        "token": token,
    }

    const result = await requestServer(JSON.stringify(requestBody), () => { });

    if (!result) {
        callback(false, "success");
        return false;
    }

    if ("error" in result) {
        callback(false, result["error"]);
        return false
    } else if ("readyForPassword" in result && result["readyForPassword"]) {
        callback(true, "ready for password", true, result["verificationsRemaining"], -1);
        return true;
    } else {
        callback(true, "more verification steps required", false, result["verificationsRemaining"], result["newIconIdToSet"]);
        return true;
    }
}

export const finalizeVerification = async (playerTag: string, token: string, password: string, callback: (success: boolean) => void) => {
    const requestBody = {
        "type": "verifyAccount",
        "verificationRequestType": "finalize",
        "playerTag": playerTag,
        "token": token,
        "password": password
    }

    const result = await requestServer(JSON.stringify(requestBody), () => { });

    if (!result) {
        callback(false)
        return false
    }

    if ("error" in result) {
        callback(false);
        return false;
    } else {
        callback(true);
        return true;
    }
}

export const verifyPassword = async (playerTag: string, password: string, callback: (success: boolean, message: string) => void) => {
    const requestBody = {
        "type": "verifyPassword",
        "playerTag": playerTag,
        "password": password
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), () => { });

    if (!requestResult) {
        callback(false, "unknown error");
        return false;
    }

    if ("error" in requestResult) {
        callback(false, requestResult["error"]);
        return false;
    } else {
        callback(true, requestResult["token"]);
        return true;
    }


}

export const fetchPlayerOverview = async (playerTag: string) => {
    const requestBody = {
        "playerTag": playerTag,
        "type": "getPlayerOverview",
    }

    const requestResult = requestServer(JSON.stringify(requestBody), () => { });
    if (requestResult) {
        return requestResult;
    } else {
        return null;
    }
}

export const updateBrawlerAndModeLabels = async () => {

    if (brawlerModeLabelsUpdateAttempted) return;

    setBrawlerModeLabelsUpdateAttempted(true);

    const requestBody = {
        "type": "getBrawlerAndModeList",
    }

    const requestResult = await requestServer(JSON.stringify(requestBody), () => { });
    if (requestResult) {
        const brawlerLabels = requestResult["brawlers"].map((brawler: string) => {
            const label = brawler
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase());

            return { value: brawler, label };
        });

        setBrawlerLabels(brawlerLabels);

        const modeLabels = requestResult["modes"].map((mode: string) => {
            const label = mode
                .replace(/([a-z])([A-Z])/g, '$1 $2') // to title case
                .toLowerCase()
                .split(/\s+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return { value: mode, label };
        });

        setModeLabels(modeLabels);

        return true;
    } else {
        return false;
    }
}
