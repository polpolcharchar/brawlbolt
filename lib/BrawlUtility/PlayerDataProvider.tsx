"use client"

import { createContext, useContext, useState } from "react";

const PlayerDataContext = createContext<any>(null);

export const PlayerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerData, setPlayerData] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);

  const updatePlayerData = (playerTag: string, playerD: any) => {

    let indexToUse = -1;
    if(playerTag !== "global"){
      indexToUse = index;
      setIndex((prevIndex) => prevIndex + 1);
    }

    setPlayerData((prevData) => ({
      ...prevData,
      [playerTag]: {
        "name": playerD,
        "sortIndex": indexToUse,
      }
    }));
    setIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <PlayerDataContext.Provider
      value={{
        playerData,
        updatePlayerData
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
};
export const usePlayerData = () => useContext(PlayerDataContext);


