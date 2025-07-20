"use client"

import React, { createContext, useContext, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const PlayerDataContext = createContext<any>(null)

export const PlayerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerData, setPlayerData] = useState<Record<string, any>>({})
  const [activePlayerTag, _setActivePlayerTag] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  const setActivePlayerTag = (newTag: string) => {
    if (activePlayerTag && pathname?.endsWith(activePlayerTag)) {
      const newPath = pathname.replace(new RegExp(`${activePlayerTag}$`), newTag)
      router.replace(newPath)
    }
    _setActivePlayerTag(newTag)
  }

  const updatePlayerData = (playerTag: string, playerD: any) => {
    setPlayerData((prevData) => ({
      ...prevData,
      [playerTag]: {
        name: playerD,
      },
    }))
  }

  return (
    <PlayerDataContext.Provider
      value={{
        playerData,
        updatePlayerData,
        activePlayerTag,
        setActivePlayerTag,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  )
}

export const usePlayerData = () => useContext(PlayerDataContext)
