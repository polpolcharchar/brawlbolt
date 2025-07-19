"use client"

import { TrieExplorerChart } from '@/components/BrawlComponents/Charts/TrieExplorerChart';
import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

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