"use client"

import { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handlePlayerSearch } from "@/lib/BrawlUtility/BrawlDataFetcher"
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider"
import { isValidTag } from "@/lib/BrawlUtility/BrawlConstants"
import { ChevronDown, Loader } from "lucide-react"

export function PlayerSelector() {
  const {
    playerData,
    updatePlayerData,
    setActivePlayerTag,
    activePlayerTag,
    isLoadingPlayer,
    setIsLoadingPlayer
  } = usePlayerData()

  const [tagInput, setTagInput] = useState("");

  const [open, setOpen] = useState(false);

  const handleSubmit = async (passedTag: string | undefined = undefined) => {

    const tagToUse = passedTag ? passedTag : tagInput;

    if (!isValidTag(tagToUse)) return
    setIsLoadingPlayer(true)
    const success = await handlePlayerSearch(tagToUse, setIsLoadingPlayer, updatePlayerData)
    setIsLoadingPlayer(false)

    if (success) {
      const normalizedTag = tagToUse.startsWith("#") ? tagToUse.substring(1) : tagToUse
      setActivePlayerTag(normalizedTag)
      setTagInput("")
      setOpen(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="!border-(--primary-foreground) !bg-(--card)"
          >
            {isLoadingPlayer && <div className="flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>}
            {activePlayerTag
              ? playerData[activePlayerTag]?.name || activePlayerTag
              : "Accounts..."}<ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Active Players</h4>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {Object.entries(playerData).map(([tag, data]: any) => (
                <Button
                  key={tag}
                  variant={tag === activePlayerTag ? "default" : "secondary"}
                  onClick={() => {
                    setActivePlayerTag(tag);
                    setOpen(false);
                  }}
                  className="justify-start text-white"
                >
                  {data.name || tag}
                </Button>
              ))}
              {Object.keys(playerData).length === 0 && (
                <p className="text-sm text-muted-foreground">No players yet</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Add New Player</h4>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value.toUpperCase().replaceAll("O", "0"))
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter a player tag..."
                disabled={isLoadingPlayer}
              />
              <Button
                onClick={() => { handleSubmit() }}
                disabled={isLoadingPlayer || !isValidTag(tagInput)}
                className="text-white"
              >
                {isLoadingPlayer ? "Loading..." : "Add"}
              </Button>
            </div>
          </div>

          {/* What is a tag Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white bg-blue-600 hover:bg-blue-700">
                Player Tag?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-200">
                  Brawl Stars Player Tags
                </DialogTitle>
              </DialogHeader>

              <div>
                <h3 className="text-xl font-semibold text-gray-200">What is mine?</h3>
                <p className="text-gray-400 mb-2">
                  Your (or any friend's) player tag can be found on any in-game account
                  page, under the profile picture. It begins with a <code>#</code>.
                </p>

                <h3 className="text-xl font-semibold text-gray-200">What is a player tag?</h3>
                <p className="text-gray-400 mb-2">
                  Every Brawl Stars account has a unique identifier that is used by the API.
                  This is <span className="font-bold">not</span> your username.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            className="ml-2 text-white"
            onClick={() => {
              handleSubmit("GJCLVRQLG");
            }}
            disabled={"GJCLVRQLG" in playerData}
          >
            Load Example Profile
          </Button>

        </PopoverContent>
      </Popover>
    </div>
  )
}
