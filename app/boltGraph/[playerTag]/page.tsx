"use client"

import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  return <div>Bolt Graph for {playerTag}</div>;
}