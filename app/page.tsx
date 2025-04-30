"use client"

import { PlayerSearchAndDataPage } from "@/components/BrawlComponents/PlayerSearchAndDataPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerSearchAndDataPage/>
    </Suspense>
  );
}
