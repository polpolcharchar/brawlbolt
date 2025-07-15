"use client"

import { createContext, useContext, useState } from "react";

const PlayerDataContext = createContext<any>(null);

export const PlayerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerData, setPlayerData] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);

  const updatePlayerData = (playerTag: string, playerD: any) => {
    setPlayerData((prevData) => ({
      ...prevData,
      [playerTag]: {
        "name": playerD,
        "sortIndex": index,
      }
    }));
    setIndex((prevIndex) => prevIndex + 1);
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


