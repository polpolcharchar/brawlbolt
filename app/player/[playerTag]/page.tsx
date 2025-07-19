"use client"

import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  return <div>Account page for {playerTag}</div>;
}