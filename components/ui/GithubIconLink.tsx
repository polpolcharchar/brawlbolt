//AI

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function GithubIconLink({ repoURL, displayText }: { repoURL: string, displayText: string }) {
  return (
    <a
      href={repoURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="flex justify-center items-center p-4 bg-background shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="text-center flex flex-col items-center">
          <img
            src="/github-mark-white.png"
            alt="GitHub Logo"
            className="h-12 w-12"
          />
          <span className="mt-2 text-white text-lg font-medium">
            {displayText}
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
