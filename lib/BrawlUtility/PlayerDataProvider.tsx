"use client"

import { createContext, useContext, useState } from "react";

export class CompiledTracker {
  wins: number;
  losses: number;
  draws: number;
  potentialTotal: number;

  constructor(dataObject: any) {
    this.wins = dataObject['wins'];
    this.losses = dataObject['losses'];
    this.draws = dataObject['draws'];
    this.potentialTotal = dataObject['potential_total'];
  }

  getWinrate() {
    return this.wins / this.potentialTotal;
  }

  getDrawRate() {
    return this.draws / this.potentialTotal;
  }

  getStarRate() {
    return (this.wins + this.losses + this.draws) / this.potentialTotal;
  }
}

export class CompiledResults {
  durationFrequencies: Record<number, number>;
  playerResultData: CompiledTracker;
  playerStarData: CompiledTracker;
  playerTrophyChange: number;

  constructor(overallObject: any) {
    this.playerResultData = new CompiledTracker(overallObject['player_result_data']);
    this.playerStarData = new CompiledTracker(overallObject['player_star_data']);
    this.durationFrequencies = overallObject['duration_frequencies'];
    this.playerTrophyChange = overallObject['player_trophy_change'];
  }
}

export class RecursiveCompiledStats {
  stat_map: Record<string, RecursiveCompiledStats>;
  overallResults: CompiledResults;

  constructor(recursiveData: any) {
    this.overallResults = new CompiledResults(recursiveData['overall']);
    this.stat_map = {};
    Object.entries(recursiveData['stat_map'] || {}).forEach(([key, value]) => {
      this.stat_map[key] = new RecursiveCompiledStats(value);
    });
  }
}

export class FrequencyCompiled {
  frequencies: Record<number, number>;

  constructor(data: any) {
    this.frequencies = data;
  }
}

export class OverallPlayerStats {
  rankedBrawlerModeMap?: RecursiveCompiledStats;
  rankedModeBrawler: RecursiveCompiledStats;
  rankedModeMapBrawler?: RecursiveCompiledStats;
  rankedBrawler?: RecursiveCompiledStats;
  regularBrawlerModeMap?: RecursiveCompiledStats;
  regularModeBrawler: RecursiveCompiledStats;
  regularModeMapBrawler?: RecursiveCompiledStats;
  regularBrawler?: RecursiveCompiledStats;

  showdownRankDistributions: Record<string, FrequencyCompiled>;



  constructor(playerD: any) {

    //ranked:
    if ('rankedBrawlerModeMap' in playerD) {
      this.rankedBrawlerModeMap = new RecursiveCompiledStats(playerD['rankedBrawlerModeMap']);
    }

    this.rankedModeBrawler = new RecursiveCompiledStats(playerD['rankedModeBrawler']);

    if ('rankedModeMapBrawler' in playerD) {
      this.rankedModeMapBrawler = new RecursiveCompiledStats(playerD['rankedModeMapBrawler']);
    }

    if ('rankedBrawler' in playerD) {
      this.rankedBrawler = new RecursiveCompiledStats(playerD['rankedBrawler'])
    }

    //Regular
    if ('regularBrawlerModeMap' in playerD) {
      this.regularBrawlerModeMap = new RecursiveCompiledStats(playerD['regularBrawlerModeMap']);
    }

    this.regularModeBrawler = new RecursiveCompiledStats(playerD['regularModeBrawler']);

    if ('regularModeMapBrawler' in playerD) {
      this.regularModeMapBrawler = new RecursiveCompiledStats(playerD['regularModeMapBrawler']);
    }

    if ('regularBrawler' in playerD) {
      this.regularBrawler = new RecursiveCompiledStats(playerD['regularBrawler'])
    }

    this.showdownRankDistributions = {};
    for (const showdownType in playerD['showdownRankCompilers']) {
      this.showdownRankDistributions[showdownType] = new FrequencyCompiled(playerD['showdownRankCompilers'][showdownType]['frequencies']);
    }
  }
}

export class OverallPlayerData {
  playerInfo: any;
  playerStats: OverallPlayerStats;

  numGames?: number;
  datetime?: Date;
  hourRange?: number;

  sortIndex: number;

  constructor(overallPlayerData: any, sortIndex: number) {

    this.sortIndex = sortIndex;

    this.playerStats = new OverallPlayerStats(overallPlayerData["playerStats"]);
    this.playerInfo = overallPlayerData['playerInfo'];

    if (overallPlayerData["playerStats"] != undefined) {
      this.numGames = overallPlayerData['playerStats']['numGames'];
      this.datetime = new Date(overallPlayerData['playerStats']['datetime']);
      this.hourRange = overallPlayerData['playerStats']['hourRange'];
    }
  }
}

export class ShallowInitialStatMap {
  stat_map: Record<string, RecursiveCompiledStats>
  sortIndex: number;

  constructor(data: any, sortIndex: number){
    this.sortIndex = sortIndex;
    this.stat_map = {};
    Object.entries(data['stat_map'] || {}).forEach(([key, value]) => {
      this.stat_map[key] = new RecursiveCompiledStats(value);
    })
  }
}

const PlayerDataContext = createContext<any>(null);

export const PlayerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerData, setPlayerData] = useState<Record<string, OverallPlayerData>>({});
  const [index, setIndex] = useState(0);

  const updatePlayerData = (playerTag: string, playerD: any) => {

    if(typeof playerD === "string"){
      setPlayerData((prevData) => ({
        ...prevData,
        [playerTag]: playerD as any,
      }));
    }else if("initialRegularModeMapBrawler" in playerD){
      setPlayerData((prevData) => ({
        ...prevData,
        [playerTag]: new ShallowInitialStatMap(playerD["initialRegularModeMapBrawler"]["regularModeMapBrawler"], index) as any,
      }));
      setIndex(index + 1);
    }else{
      const newDataObject = new OverallPlayerData(playerD, playerTag === "Global" ? -1 : index);
      setIndex(index + 1);

      setPlayerData((prevData) => ({
        ...prevData,
        [playerTag]: newDataObject,
      }));
    }
  };

  return (
    <PlayerDataContext.Provider
      value={{
        playerData,
        updatePlayerData,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
};
export const usePlayerData = () => useContext(PlayerDataContext);


