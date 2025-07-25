"use client"

import { handleDynamicPlayerTagPath } from '@/components/BrawlComponents/HandleDynamicPlayerTag';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlayerData } from '@/lib/BrawlUtility/PlayerDataProvider';
import { useParams, useRouter } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  const playerTag = params.playerTag;

  handleDynamicPlayerTagPath({ playerTagParam: playerTag });

  const {activePlayerTag} = usePlayerData();

  const router = useRouter()

  const handleRedirect = async (basePath: string) => {
    router.push(`/${basePath}/${activePlayerTag?.toString().replace("#", "")}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">BrawlBolt Account Page</h1>
        <p className="text-lg text-gray-600">
          {activePlayerTag}
        </p>
      </div>
      <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CardDescription>Favorite mode, brawler, and more!</CardDescription>
            <Button className='text-white'
              onClick={() => {
                handleRedirect("boltGraph");
              }}
            >
              Go to BoltGraph
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-[0.5rem] text-gray-500">{"Account Verification?"}</p>

          </CardFooter>
        </Card>
      </div>
    </div>

  );
}