
// Initial labels
// These may be updated from the API later
export let brawlerLabelUpdateAttempted = false;
export const setBrawlerLabelUpdateAttempted = (value: boolean) => {
    brawlerLabelUpdateAttempted = value;
}
export const setBrawlerLabels = (labels: { value: string, label: string }[]) => {
    brawlerLabels = labels;
}
export let brawlerLabels = [
    { "value": "8-BIT", "label": "8-Bit" },
    { "value": "ALLI", "label": "Alli" },
    { "value": "AMBER", "label": "Amber" },
    { "value": "ANGELO", "label": "Angelo" },
    { "value": "ASH", "label": "Ash" },
    { "value": "BARLEY", "label": "Barley" },
    { "value": "BEA", "label": "Bea" },
    { "value": "BELLE", "label": "Belle" },
    { "value": "BERRY", "label": "Berry" },
    { "value": "BIBI", "label": "Bibi" },
    { "value": "BO", "label": "Bo" },
    { "value": "BONNIE", "label": "Bonnie" },
    { "value": "BROCK", "label": "Brock" },
    { "value": "BULL", "label": "Bull" },
    { "value": "BUSTER", "label": "Buster" },
    { "value": "BUZZ", "label": "Buzz" },
    { "value": "BYRON", "label": "Byron" },
    { "value": "CARL", "label": "Carl" },
    { "value": "CHARLIE", "label": "Charlie" },
    { "value": "CHESTER", "label": "Chester" },
    { "value": "CHUCK", "label": "Chuck" },
    { "value": "CLANCY", "label": "Clancy" },
    { "value": "COLETTE", "label": "Colette" },
    { "value": "COLT", "label": "Colt" },
    { "value": "CORDELIUS", "label": "Cordelius" },
    { "value": "CROW", "label": "Crow" },
    { "value": "DARRYL", "label": "Darryl" },
    { "value": "DOUG", "label": "Doug" },
    { "value": "DRACO", "label": "Draco" },
    { "value": "DYNAMIKE", "label": "Dynamike" },
    { "value": "EDGAR", "label": "Edgar" },
    { "value": "EL PRIMO", "label": "El Primo" },
    { "value": "EMZ", "label": "Emz" },
    { "value": "EVE", "label": "Eve" },
    { "value": "FANG", "label": "Fang" },
    { "value": "FINX", "label": "Finx" },
    { "value": "FRANK", "label": "Frank" },
    { "value": "GALE", "label": "Gale" },
    { "value": "GENE", "label": "Gene" },
    { "value": "GRAY", "label": "Gray" },
    { "value": "GRIFF", "label": "Griff" },
    { "value": "GROM", "label": "Grom" },
    { "value": "GUS", "label": "Gus" },
    { "value": "HANK", "label": "Hank" },
    { "value": "JACKY", "label": "Jacky" },
    { "value": "JAE-YONG", "label": "Jae-yong" },
    { "value": "JANET", "label": "Janet" },
    { "value": "JESSIE", "label": "Jessie" },
    { "value": "JUJU", "label": "Juju" },
    { "value": "KAZE", "label": "Kaze" },
    { "value": "KENJI", "label": "Kenji" },
    { "value": "KIT", "label": "Kit" },
    { "value": "LARRY & LAWRIE", "label": "Larry & Lawrie" },
    { "value": "LEON", "label": "Leon" },
    { "value": "LILY", "label": "Lily" },
    { "value": "LOLA", "label": "Lola" },
    { "value": "LOU", "label": "Lou" },
    { "value": "LUMI", "label": "Lumi" },
    { "value": "MAISIE", "label": "Maisie" },
    { "value": "MANDY", "label": "Mandy" },
    { "value": "MAX", "label": "Max" },
    { "value": "MEEPLE", "label": "Meeple" },
    { "value": "MEG", "label": "Meg" },
    { "value": "MELODIE", "label": "Melodie" },
    { "value": "MICO", "label": "Mico" },
    { "value": "MOE", "label": "Moe" },
    { "value": "MORTIS", "label": "Mortis" },
    { "value": "MR. P", "label": "Mr. P" },
    { "value": "NANI", "label": "Nani" },
    { "value": "NITA", "label": "Nita" },
    { "value": "OLLIE", "label": "Ollie" },
    { "value": "OTIS", "label": "Otis" },
    { "value": "PAM", "label": "Pam" },
    { "value": "PEARL", "label": "Pearl" },
    { "value": "PENNY", "label": "Penny" },
    { "value": "PIPER", "label": "Piper" },
    { "value": "POCO", "label": "Poco" },
    { "value": "R-T", "label": "R-T" },
    { "value": "RICO", "label": "Rico" },
    { "value": "ROSA", "label": "Rosa" },
    { "value": "RUFFS", "label": "Ruffs" },
    { "value": "SAM", "label": "Sam" },
    { "value": "SANDY", "label": "Sandy" },
    { "value": "SHADE", "label": "Shade" },
    { "value": "SHELLY", "label": "Shelly" },
    { "value": "SPIKE", "label": "Spike" },
    { "value": "SPROUT", "label": "Sprout" },
    { "value": "SQUEAK", "label": "Squeak" },
    { "value": "STU", "label": "Stu" },
    { "value": "SURGE", "label": "Surge" },
    { "value": "TARA", "label": "Tara" },
    { "value": "TICK", "label": "Tick" },
    { "value": "TRUNK", "label": "Trunk" },
    { "value": "WILLOW", "label": "Willow" }
];

export const modeLabels = [
    { "value": "brawlBall", "label": "Brawl Ball" },
    { "value": "heist", "label": "Heist" },
    { "value": "hotZone", "label": "Hot Zone" },
    { "value": "gemGrab", "label": "Gem Grab" },
    { "value": "bounty", "label": "Bounty" },
    { "value": "knockout", "label": "Knockout" },
    { "value": "brawlArena", "label": "Brawl Arena" },
    { "value": "duels", "label": "Duels" },
    { "value": "soloShowdown", "label": "Solo Showdown" },
    { "value": "duoShowdown", "label": "Duo Showdown" },
    { "value": "trioShowdown", "label": "Trio Showdown" },
    { "value": "gemGrab5V5", "label": "Gem Grab 5v5" },
    { "value": "brawlBall5V5", "label": "Brawl Ball 5v5" },
    { "value": "knockout5V5", "label": "Knockout 5v5" },
    { "value": "trophyThieves", "label": "Trophy Thieves" },
    { "value": "wipeout", "label": "Wipeout" },
    { "value": "siege", "label": "Siege" },
    { "value": "volleyBrawl", "label": "Volley Brawl" },
    { "value": "dodgeBrawl", "label": "Dodge Brawl" },
    { "value": "basketBrawl", "label": "Basket Brawl" },
    { "value": "wipeout5V5", "label": "Wipeout 5v5" },
    { "value": "botDrop", "label": "Bot Drop" },
    { "value": "brawlHockey5V5", "label": "Brawl Hockey 5v5" },
    { "value": "brawlHockey", "label": "Brawl Hockey" },
    { "value": "soulCollector", "label": "Soul Collector" },
    { "value": "hunters", "label": "Hunters" },
]
export const rankedModeLabels = [
    { "value": "brawlBall", "label": "Brawl Ball" },
    { "value": "heist", "label": "Heist" },
    { "value": "hotZone", "label": "Hot Zone" },
    { "value": "gemGrab", "label": "Gem Grab" },
    { "value": "bounty", "label": "Bounty" },
    { "value": "knockout", "label": "Knockout" },
]

export const modeLabelMap = {
    brawlBall: "Brawl Ball",
    heist: "Heist",
    hotZone: "Hot Zone",
    gemGrab: "Gem Grab",
    bounty: "Bounty",
    knockout: "Knockout",
    brawlArena: "Brawl Arena",
    duels: "Duels",
    soloShowdown: "Solo Showdown",
    duoShowdown: "Duo Showdown",
    trioShowdown: "Trio Showdown",
    gemGrab5V5: "Gem Grab 5v5",
    brawlBall5V5: "Brawl Ball 5v5",
    knockout5V5: "Knockout 5v5",
    trophyThieves: "Trophy Thieves",
    wipeout: "Wipeout",
    siege: "Siege",
    volleyBrawl: "Volley Brawl",
    dodgeBrawl: "Dodge Brawl",
    basketBrawl: "Basket Brawl",
    wipeout5V5: "Wipeout 5v5",
    botDrop: "Bot Drop",
    brawlHockey5V5: "Brawl Hockey 5v5",
    brawlHockey: "Brawl Hockey",
    soulCollector: "Soul Collector",
    hunters: "Hunters"
}
export const rankedModeLabelMap = {
    brawlBall: "Brawl Ball",
    heist: "Heist",
    hotZone: "Hot Zone",
    gemGrab: "Gem Grab",
    bounty: "Bounty",
    knockout: "Knockout",
}

export function isValidTag(tag: string): boolean {
    // Define the set of valid characters
    const validChars = new Set(['P', 'Y', 'L', 'Q', 'G', 'R', 'J', 'C', 'U', 'V', '0', '2', '8', '9', '#']);

    // Check if the tag contains only valid characters
    for (let char of tag.toUpperCase()) {
        if (!validChars.has(char)) {
            return false;
        }
    }

    // Ensure the tag has at least 3 characters (the shortest valid tag found)
    if (tag.length < 3) {
        return false;
    }

    return true;
}

const _mapToModeOverrides: Record<string, string> = {
    "Moonbark Meadow": "dodgeBrawl",
    "Rebound Ring": "dodgeBrawl",
    "Hug or Hurl": "dodgeBrawl",
    "Side Hustle": "dodgeBrawl",
    "Squish Court": "dodgeBrawl",
    "Wispwillow Ward": "dodgeBrawl",

    "Arena of Glory": "brawlArena",
    "Mirage Arena": "brawlArena",
    "Knockout Grounds": "brawlArena",
    "The Smackdome": "brawlArena",

    "Super Center": "brawlHockey",
    "Slippery Slap": "brawlHockey",
    "Bouncy Bowl": "brawlHockey",
    "Below Zero": "brawlHockey",
    "Cool Box": "brawlHockey",
    "Starr Garden": "brawlHockey",

    "Snowcone Square": "brawlHockey5V5",
    "Massive Meltdown": "brawlHockey5V5",
    "Frostbite Rink": "brawlHockey5V5",
    "Cold Snap": "brawlHockey5V5",

    "Divine Descent": "spiritWars",
    "Final Frontier": "spiritWars",
    "Celestial Crusade": "spiritWars",
    "Radiant Rampage": "spiritWars",
    "Hellish Harvest": "spiritWars",
    "Infernal Invasion": "spiritWars",
    "Abyssal Assault": "spiritWars",
    "Underworld Uprising": "spiritWars",

    "Foursquare Fortress": "soulCollector",
    "Hoop Boot Hill": "soulCollector",
    "Afterpiece Arena": "soulCollector",
    "Paperback Pond": "soulCollector",
    "Broiler Room": "soulCollector",
    "Kooky Gates": "soulCollector",
}
export function getMode(match: any): string {
  if (
    match?.event?.map &&
    _mapToModeOverrides.hasOwnProperty(match.event.map)
  ) {
    return _mapToModeOverrides[match.event.map];
  } else if (match?.event?.mode && match.event.mode !== "unknown") {
    return match.event.mode;
  } else if (match?.battle?.mode) {
    return match.battle.mode;
  } else {
    return "unknown";
  }
}

const BRAWLER_ICON_ID_TO_NAME: Record<number, string> = {
  28000003: "Shelly",
  28000007: "Nita",
  28000004: "Colt",
  28000010: "Bull",
  28000005: "Brock",
  28000009: "El Primo",
  28000012: "Barley",
  28000013: "Poco",
  28000040: "Rosa",
};
export function getBrawlerNameFromIconID(id: number): string | undefined {
  return BRAWLER_ICON_ID_TO_NAME[id];
}
