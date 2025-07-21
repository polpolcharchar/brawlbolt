"use client"

import { TrieExplorerChart } from '@/components/BrawlComponents/Charts/TrieExplorerChart';
import { isValidTag } from '@/lib/BrawlUtility/BrawlConstants';
import { handlePlayerSearch } from '@/lib/BrawlUtility/BrawlDataFetcher';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  const { updatePlayerData, setActivePlayerTag, playerData } = usePlayerData();
  useEffect(() => {
    const playerTagString = playerTag?.toString();
    if (!playerTagString || !isValidTag(playerTagString) || playerTagString in playerData) return;

    const fetchData = async () => {
      const success = await handlePlayerSearch(playerTagString, () => { }, updatePlayerData)

      if (success) {
        const normalizedTag = playerTagString.startsWith("#") ? playerTagString.substring(1) : playerTagString
        setActivePlayerTag(normalizedTag)
      }

    }
    fetchData();
  }, []);

  return (
    <div>
      {playerTag && (
        <div>
          <TrieExplorerChart playerTag={playerTag?.toString()} isGlobal={false} />
        </div>
      )}
    </div>
  );
}