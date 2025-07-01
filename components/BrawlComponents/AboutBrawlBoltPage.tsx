"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import GithubIconLink from "../ui/GithubIconLink"


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

                            {/* Overview Section */}
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Overview</h3>
                                <p className="text-gray-400">
                                    BrawlBolt tracks your games and provides personalized detailed statistics using every piece of game data possible.
                                    The options for personalized data analysis are unrivaled compared to other Brawl Stars tracking sites.
                                    Search your account to get started for <b>FREE</b>!
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

                            <section className="">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">To learn more, visit these GitHub repositories:</h3>
                                <div className="flex justify-center items-center w-full">
                                    <div className="flex w-full justify-center gap-8">
                                        <GithubIconLink repoURL="https://github.com/polpolcharchar/brawlboltbackend" displayText="Main GitHub" />
                                        <GithubIconLink repoURL="https://github.com/polpolcharchar/brawlbolt" displayText="Website GitHub" />
                                    </div>
                                </div>
                            </section>

                        </div>
                    </Card>

                    <footer className="text-sm text-gray-500">
                        This material is unofficial and is not endorsed by Supercell.
                    </footer>
                    <footer className="text-sm text-gray-500">
                        For more information see Supercell's Fan Content Policy:{" "}
                        <a
                            href="https://www.supercell.com/fan-content-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.supercell.com/fan-content-policy
                        </a>.
                    </footer>

                </div>
            )}
        </div>
    )

}
