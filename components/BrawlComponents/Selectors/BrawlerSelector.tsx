import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { brawlerLabels } from "@/lib/BrawlUtility/BrawlConstants"
import clsx from "clsx"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"


type BrawlerChoice = {
    value: string
    label: string
}

export const BrawlerSelector = ({ brawler, setBrawler, selectBrawlerLabels = brawlerLabels }: { brawler: string, setBrawler: (value: string) => void, selectBrawlerLabels?: BrawlerChoice[] }) => {

    const [brawlerPopoverOpen, setBrawlerPopoverOpen] = useState(false);

    return (
        <Popover open={brawlerPopoverOpen} onOpenChange={setBrawlerPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={brawlerPopoverOpen}
                    className="max-w-[200px] w-full justify-between"
                >
                    {brawler
                        ? selectBrawlerLabels.find((brawlerChoice) => brawlerChoice.value === brawler)?.label
                        : "Select brawler..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
                <Command>
                    <CommandInput placeholder="Search brawlers..." />
                    <CommandList>
                        <CommandEmpty>No brawler found</CommandEmpty>
                        <CommandGroup>
                            {selectBrawlerLabels.map((brawlerChoice) => (
                                <CommandItem
                                    key={brawlerChoice.value}
                                    value={brawlerChoice.value}
                                    onSelect={(currentValue: string) => {
                                        setBrawler(currentValue === brawler ? "" : currentValue)
                                        setBrawlerPopoverOpen(false)
                                    }}
                                >
                                    <Check
                                        className={clsx(
                                            "mr-2 h-4 w-4",
                                            brawler === brawlerChoice.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {brawlerChoice.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

}