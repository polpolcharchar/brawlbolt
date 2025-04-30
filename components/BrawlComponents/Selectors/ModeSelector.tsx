"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { modeLabels } from "@/lib/BrawlUtility/BrawlConstants"
import clsx from "clsx"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

type ModeChoice = {
  value: string
  label: string
}

export const ModeSelector = ({ mode, setMode, selectModeLabels = modeLabels}: {mode: string, setMode: (value: string) => void, selectModeLabels?: ModeChoice[]}) => {
  const [modePopoverOpen, setModePopoverOpen] = useState(false)

  return (
    <Popover open={modePopoverOpen} onOpenChange={setModePopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={modePopoverOpen}
          className="max-w-[200px] w-full justify-between"
        >
          {mode
            ? selectModeLabels.find((modeChoice) => modeChoice.value === mode)?.label
            : "Select mode..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <Command>
          {/* <CommandInput placeholder="Search modes..." /> */}
          <CommandList>
            <CommandEmpty>No mode found</CommandEmpty>
            <CommandGroup>
              {selectModeLabels.map((modeChoice) => (
                <CommandItem
                  key={modeChoice.value}
                  value={modeChoice.value}
                  onSelect={(currentValue: string) => {
                    setMode(currentValue === mode ? "" : currentValue)
                    setModePopoverOpen(false)
                  }}
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      mode === modeChoice.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {modeChoice.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
