import { TrieExplorerChart } from "@/components/BrawlComponents/Charts/TrieExplorerChart";

export default function UserPage() {
  return (
    <TrieExplorerChart playerTag="global" isGlobal={true} />
  );
}