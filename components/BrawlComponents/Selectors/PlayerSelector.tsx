"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { isValidTag } from "@/lib/BrawlUtility/BrawlConstants"
import { handlePlayerSearch, verifyPassword } from "@/lib/BrawlUtility/BrawlDataFetcher"
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider"
import { CheckCircle, ChevronDown, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function PlayerSelector() {
  const {
    playerData,
    updatePlayerData,
    setActivePlayerTag,
    activePlayerTag,
    isLoadingPlayer,
    setIsLoadingPlayer
  } = usePlayerData();

  const router = useRouter()

  const [tagInput, setTagInput] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyErrorMessage, setVerifyErrorMessage] = useState("");

  const [open, setOpen] = useState(false);

  const handleNewTagSubmit = async (passedTag: string | undefined = undefined) => {

    const tagToUse = passedTag ? passedTag : tagInput;

    if (!isValidTag(tagToUse)) return
    setIsLoadingPlayer(true)
    const success = await handlePlayerSearch(tagToUse, setIsLoadingPlayer, updatePlayerData)
    setIsLoadingPlayer(false)

    if (success) {
      const normalizedTag = tagToUse.startsWith("#") ? tagToUse.substring(1) : tagToUse
      setActivePlayerTag(normalizedTag)
      setTagInput("")
      // setOpen(false);
    }
  }

  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const handleVerifyPasswordSubmit = () => {
    setIsVerifyingPassword(true);

    setVerifyErrorMessage("");

    const tagToVerify = activePlayerTag;

    verifyPassword(tagToVerify, verifyInput, (success: boolean, message: string) => {
      if (!success) {
        setVerifyErrorMessage(message);
      } else {
        updatePlayerData(tagToVerify, playerData[tagToVerify].name, message, playerData[tagToVerify]["verified"]);
      }
      setIsVerifyingPassword(false);
    });
    setVerifyInput("");
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="!border-(--primary-foreground) !bg-(--card) text-(--foreground)"
          >
            {isLoadingPlayer && <div className="flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>}
            {activePlayerTag
              ? playerData[activePlayerTag]?.name || activePlayerTag
              : "Accounts..."}<ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4 mx-2 text-(--foreground)">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Active Players</h4>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {Object.entries(playerData).map(([tag, data]: any) => (
                <div key={tag} className="flex w-full gap-2 items-center">
                  <Button
                    key={tag}
                    variant={tag === activePlayerTag ? "default" : "secondary"}
                    onClick={() => {
                      setActivePlayerTag(tag);
                      // setOpen(false);
                    }}
                    className="flex-grow justify-start text-(--foreground)"
                  >
                    {data.name || tag}
                  </Button>
                  {playerData[tag]["token"] && (
                    <div className="flex items-center justify-center gap-1">
                      <span title="Verified"><CheckCircle className="text-(--primary)" /></span>
                      <p className="text-sm text-gray-500">Verified</p>
                    </div>
                  )}
                </div>

              ))}
              {Object.keys(playerData).length === 0 && (
                <p className="text-sm text-muted-foreground">No players yet</p>
              )}
            </div>
          </div>

          {activePlayerTag && !playerData[activePlayerTag]["token"] && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Verify {activePlayerTag}</h4>
              {playerData[activePlayerTag]["verified"] ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={verifyInput}
                      onChange={(e) =>
                        setVerifyInput(e.target.value)
                      }
                      type="password"
                      placeholder="Enter your password"
                      disabled={isLoadingPlayer}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          handleVerifyPasswordSubmit();
                        }
                      }}
                    />
                    <Button
                      onClick={() => { handleVerifyPasswordSubmit() }}
                      disabled={isVerifyingPassword || !verifyInput}
                      className="text-(--foreground)"
                    >
                      {isLoadingPlayer ? "Loading..." : "Submit"}
                    </Button>
                  </div>
                  <div className="text-left font-bold text-red-500 mb-2">
                    <p>{verifyErrorMessage}</p>
                  </div>
                  <Button className="w-full text-(--foreground)" onClick={() => router.push("/verify")}>
                    Forgot password? Re-verify Account
                  </Button>
                </div>
              ) : (
                <Button className="w-full text-(--foreground)" onClick={() => router.push("/verify")}>
                  Verify Account
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Add New Player</h4>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value.toUpperCase().replaceAll("O", "0"))
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleNewTagSubmit();
                  }
                }} placeholder="Enter a player tag..."
                disabled={isLoadingPlayer}
              />
              <Button
                onClick={() => { handleNewTagSubmit() }}
                disabled={isLoadingPlayer || !isValidTag(tagInput)}
                className="text-(--foreground)"
              >
                {isLoadingPlayer ? "Loading..." : "Add"}
              </Button>
            </div>
          </div>

          {/* What is a tag Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-(--foreground)">
                Player Tag?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md text-(--foreground)">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Brawl Stars Player Tags
                </DialogTitle>
              </DialogHeader>

              <div>
                <h3 className="text-xl font-semibold">What is mine?</h3>
                <p className="text-(--muted-foreground) mb-2">
                  Your (or any friend's) player tag can be found on any in-game account
                  page, under the profile picture. It begins with a <code>#</code>.
                </p>

                <h3 className="text-xl font-semibold">What is a player tag?</h3>
                <p className="text-(--muted-foreground) mb-2">
                  Every Brawl Stars account has a unique identifier that is used by the API.
                  This is <span className="font-bold">not</span> your username.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            className="ml-2 text-(--foreground)"
            onClick={() => {
              handleNewTagSubmit("GJCLVRQLG");
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
