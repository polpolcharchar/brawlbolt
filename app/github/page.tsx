import { Card } from "@/components/ui/card";
import GithubIconLink from "@/components/ui/GithubIconLink";

export default function GitHubPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[90svh] px-4 py-12 space-y-10">
            <Card className="max-w-xl text-center p-2 border rounded-md text-(--foreground)">
                <h1 className="text-4xl font-bold tracking-tight mb-4">BrawlBolt GitHub</h1>
                <section className="">
                    <h3 className="mb-4 text-xl font-semibold mb-2">BrawlBolt is an open-source project. README's may be outdated. To learn more, visit these GitHub repositories:</h3>
                    <div className="flex justify-center items-center w-full">
                        <div className="flex w-full justify-center gap-8">
                            <GithubIconLink repoURL="https://github.com/polpolcharchar/brawlboltbackend" displayText="Main" />
                            <GithubIconLink repoURL="https://github.com/polpolcharchar/brawlbolt" displayText="Website" />
                        </div>
                    </div>
                </section>
            </Card>
        </div>
    );
}