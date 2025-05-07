"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { usePathname } from "next/navigation"


export const AboutBrawlBoltPage = () => {

    const pathName = usePathname();

    return (
        <div>
            {pathName !== "/moreInfo" && (
                <div className="flex flex-col items-center p-4">

                    {/* Site Description */}
                    <Card className="w-full max-w-2xl text-center shadow-md p-6 mb-8">
                        <div className="text-gray-300">
                            <h2 className="text-3xl font-semibold mb-4">About BrawlBolt</h2>
                            <Button className="bg-blue-500 text-white font-medium text-lg px-4 py-5 rounded-lg shadow hover:bg-blue-600 transition mb-4">
                                <Link href={"/moreInfo"}>Click here to learn more</Link>
                            </Button>
                            {/* <div className="flex items-start justify-between text-gray-300">
                                <div>
                                </div>
                            </div> */}

                            {/* Overview Section */}
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Overview</h3>
                                <p className="text-gray-400">
                                    BrawlBolt provides unique detailed statistics using every piece of game data possible.
                                    The options for personalized data analysis are unrivaled compared to other Brawl Stars tracking sites.
                                    Normal account statistics like trophies, level, and club exist on any Brawl website; they are not prioritized here.{" "}
                                    <a className="underline" href="/track">Begin tracking</a> your account to get started for <b>FREE</b>!
                                </p>
                            </section>

                            {/* Tracking Section */}
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Tracking</h3>
                                <p className="text-gray-400">
                                    Player games are passively tracked and compiled as needed.
                                    As soon as you begin tracking your account, <u>every single game you play for the next month is saved</u>.
                                    To ensure your account is continually tracked, <u>access your account's statistics at least once a month</u>.
                                    Unfortunately, a record of games played before tracking began is inaccessible {"(other than the most recent 25 games)"}.
                                </p>
                            </section>

                            {/* Analysis Section */}
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Analysis</h3>
                                <p className="text-gray-400">
                                    With optimized stat caching, it doesn{"'"}t matter how many games you play—statistics will always be available almost instantly.
                                    Recursive data analysis allows for extremely detailed results.
                                </p>
                            </section>

                            {/* Footer */}
                            <footer className="text-sm text-gray-500">
                                Tracked games may be used for global statistics in the future. Stay tuned for updates!
                            </footer>
                        </div>
                    </Card>

                    <footer className="text-sm text-gray-500">
                        Not affiliated with nor endorsed by Supercell.
                    </footer>
                </div>
            )}
        </div>
    )

}
