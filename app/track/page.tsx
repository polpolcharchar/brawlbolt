"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect to the root page
  }, [router]);

  return null; // No content is rendered
}
