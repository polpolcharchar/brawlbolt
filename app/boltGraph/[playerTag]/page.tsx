"use client"

import { TrieExplorerChart } from '@/components/BrawlComponents/Charts/TrieExplorerChart';
import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { useParams } from 'next/navigation';

export default function BoltGraphPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  handleDynamicPlayerTagPath({playerTagParam: playerTag});

  const {activePlayerTag} = usePlayerData();

  return (
    <div>
      {activePlayerTag && (
        <div>
          <TrieExplorerChart playerTag={activePlayerTag} isGlobal={false} />
        </div>
      )}
    </div>
  );
}