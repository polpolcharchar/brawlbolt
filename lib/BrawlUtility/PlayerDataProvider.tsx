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
    Object.entries(recursiveData['stat_map']).forEach(([key, value]) => {
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
  rankedBrawlerModeMap: RecursiveCompiledStats;
  rankedModeBrawler: RecursiveCompiledStats;
  rankedModeMapBrawler: RecursiveCompiledStats;
  regularBrawlerModeMap: RecursiveCompiledStats;
  regularModeBrawler: RecursiveCompiledStats;
  regularModeMapBrawler: RecursiveCompiledStats;

  showdownRankDistributions: Record<string, FrequencyCompiled>;



  constructor(playerD: any) {
    this.rankedBrawlerModeMap = new RecursiveCompiledStats(playerD['rankedBrawlerModeMap']);
    this.rankedModeBrawler = new RecursiveCompiledStats(playerD['rankedModeBrawler']);
    this.rankedModeMapBrawler = new RecursiveCompiledStats(playerD['rankedModeMapBrawler']);
    this.regularBrawlerModeMap = new RecursiveCompiledStats(playerD['regularBrawlerModeMap']);
    this.regularModeBrawler = new RecursiveCompiledStats(playerD['regularModeBrawler']);
    this.regularModeMapBrawler = new RecursiveCompiledStats(playerD['regularModeMapBrawler']);

    this.showdownRankDistributions = {};
    for(const showdownType in playerD['showdownRankCompilers']){
      this.showdownRankDistributions[showdownType] = new FrequencyCompiled(playerD['showdownRankCompilers'][showdownType]['frequencies']);
    }
  }
}

export class OverallPlayerData {
  playerInfo: any;
  playerStats: OverallPlayerStats;

  constructor(overallPlayerData: any){
    this.playerStats = new OverallPlayerStats(overallPlayerData["playerStats"]);
    this.playerInfo = overallPlayerData['playerInfo'];
  }
}


const PlayerDataContext = createContext<any>(null);

export const PlayerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerData, setPlayerData] = useState<Record<string, OverallPlayerData>>({});

  const updatePlayerData = (playerTag: string, playerD: any) => {

    if(typeof playerD !== "string"){
      const test = new OverallPlayerData(playerD);
  
      setPlayerData((prevData) => ({
        ...prevData,
        [playerTag]: test,
      }));
    }else{
      setPlayerData((prevData) => ({
        ...prevData,
        [playerTag]: playerD as any,
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
