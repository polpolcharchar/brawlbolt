# BrawlBolt

A Brawl Stars statistic-tracking and global statistic website. This repository is the web application that utilizes Next.js, tailwindcss, and ShadCN. BrawlBolt provides unique detailed statistics using every piece of game data possible. The options for personalized data analysis are unrivaled compared to other Brawl Stars tracking sites. Normal account statistics like trophies, level, and club exist on any Brawl website; they are not prioritized here.

## Account Tracking

Player games are passively tracked and compiled as needed. The Brawl Stars API provides access to a player's most recent 25 games. Every 60 minutes, BrawlBolt accesses these and saves any unsaved matches for every account that has been active on this site in the past 30 days. To ensure your account is continually tracked, access your account's statistics at least once a month. If a player plays more than 25 games in a 60 minute period, there is a chance that BrawlBolt will be unable to save some of the games. BrawlBolt saves raw API data in a database.

## Statistic Compilation

To prevent scanning thousands of games to access a single statistic, BrawlBolt implements stat caching. When games are saved, they are marked as uncached. Every few days, a program loads a player's currently cached stats along with that player's uncached games. It analyzes these games, marking them as cached and adding their results to the cached statistics. Because of this process, when a user requests their account statistics, the time it takes is always the same; all that needs to be done is retrieving the cached stats.

## Global Statistics

BrawlBolt displays global Brawl Stars statistics. It calculates specific statsitics down to individual brawlers and brawlers per mode.
