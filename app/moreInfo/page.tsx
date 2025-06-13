import { Card } from "@/components/ui/card";

const Page = () => {


    return (
        <div className="flex flex-col items-center p-4">

            {/* Site Description */}
            <Card className="w-full max-w-4xl text-center shadow-md p-6 mb-4">
                <div className="text-gray-300">
                    <h2 className="text-2xl font-semibold mb-4">More About BrawlBolt:</h2>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Inspiration</h3>
                        <p className="text-gray-400">
                            Ever wondered what your star rate is when playing Shelly on the Sunny Soccer Brawl Ball map?
                            There are plenty of other Brawl Stars statistic websites, no major ones can answer questions like this.
                            Of all the sites, very few have the ability to cache your played games. Of the ones that do, they don't do very much with the data.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Tracking Details</h3>
                        <p className="text-gray-400">
                            The Brawl Stars API provides access to a player's most recent 25 games.
                            Every 60 minutes, BrawlBolt accesses these and saves any unsaved matches for every account that has been active on this site in the past 30 days.
                            To ensure your account is continually tracked, access your account's statistics at least once a month.
                            If a player plays more than 25 games in a 60 minute period, there is a chance that BrawlBolt will be unable to save some of the games.
                            BrawlBolt saves raw API data in a database. Currently, match history is unavailable, but this is <b>coming soon!</b>{" "}
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Statistic Compilation: Simple Approach</h3>
                        <p className="text-gray-400">
                            One approach to providing statistics would be to only store a player's matches and fully calculating statistics when requested.
                            This would work; however, as the number of games increased, so too would the computation time.
                            A very active account that plays ~50 games per day would accumulate {">"}18,000 games per year.
                            It would not be smart to attempt to scan every single one of these games each time stats were needed.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Statistic Compilation: BrawlBolt</h3>
                        <p className="text-gray-400">
                            BrawlBolt solves the aforementioned problem by periodically caching player stats.
                            When games are saved, they are marked as uncached.
                            Every few days, a program loads a player's currently cached stats along with that player's uncached games.
                            It analyzes these games, marking them as cached and adding their results to the cached statistics.
                            Because of this process, when a user requests their account statistics, the time it takes is always the same;
                            all that needs to be done is retrieving the cached stats.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Statistic Analysis</h3>
                        <p className="text-gray-400">
                            BrawlBolt caches wins, losses, draws, star player wins, star player losses, star player draws, game durations, and showdown ranks.
                            The structure in which BrawlBolt stores these allows for extremely detailed analysis.
                            Mode, map, and brawler values are stored recursively.
                            The three relevant orders of these are {"brawler->mode->map, mode->map->brawler, and mode->brawler"}.
                            This allows requests for a brawler in general, a map in general, a brawler in general, a brawler in a specific mode, and much more.
                            <b>{" "}Coming soon,{" "}</b>users will be able to view this raw data.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Miscellaneous</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Star rate is like winrate but for being star player.</li>
                            <li>In showdown, getting first is considered being the star player.</li>
                            <li>
                                As of now, the individual games of a ranked match are considered individual games.
                                This means that if you win a ranked match 2-0, it is represented as two different games.
                            </li>
                            <li>The API does not differentiate between the siege and cleaning duty gamemode, so they are listed as one mode here.</li>
                        </ul>
                    </section>


                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Future Plans</h3>
                        <p className="text-gray-400">
                            Features coming soon are raw data access and match history.
                            Raw data will come first and allow users to manually analyze the data used by the charts.
                            Match history will come next. This may be monetized, as it has the potential to be very resource intensive.
                            If this site gains enough users, global statistic analysis will be implemented.
                            Other Brawl Stars sites currently have this, but it will be much more detailed on BrawlBolt.
                        </p>
                    </section>
                </div>
            </Card>
        </div>
    )
}

export default Page;