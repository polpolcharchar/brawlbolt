import { useEffect } from "react";
import { isValidTag } from "@/lib/BrawlUtility/BrawlConstants";
import { handlePlayerSearch } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";

type handleDynamicPlayerTagPathOptions = {
  playerTagParam: string | string[] | undefined;
  onSuccess?: (normalizedTag: string) => void;
};

export function handleDynamicPlayerTagPath({ playerTagParam, onSuccess }: handleDynamicPlayerTagPathOptions) {
  const {
    updatePlayerData,
    setActivePlayerTag,
    playerData,
    setIsLoadingPlayer,
  } = usePlayerData();

  useEffect(() => {
    const playerTagString = playerTagParam?.toString();
    if (!playerTagString || !isValidTag(playerTagString) || playerTagString in playerData) return;

    const normalizedTag = (playerTagString.startsWith("#") ? playerTagString.substring(1) : playerTagString).toUpperCase();

    const fetchData = async () => {
      const success = await handlePlayerSearch(normalizedTag, setIsLoadingPlayer, updatePlayerData);
      if (success) {
        setActivePlayerTag(normalizedTag);
        if (onSuccess) onSuccess(normalizedTag);
      }
    };

    fetchData();
  }, [playerTagParam]);
}
