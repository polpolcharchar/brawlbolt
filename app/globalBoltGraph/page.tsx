import { TrieExplorerChart } from "@/components/BrawlComponents/Charts/TrieExplorerChart";

export default function GlobalBoltGraphPage() {
  return (
    <TrieExplorerChart playerTag="global" isGlobal={true} />
  );
}