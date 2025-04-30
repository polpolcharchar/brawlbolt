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
import clsx from "clsx"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

export const StatTypeSelector = ({ statType, setStatType }: { statType: string, setStatType: (value: string) => void }) => {

    const [open, setOpen] = useState(false);

    const statTypes = [
        { "value": "winrate", "label": "Winrate" },
        { "value": "starRate", "label": "Star Rate" },
        { "value": "trophyChange", "label": "Trophy Change" },
        { "value": "trophyChangePerGame", "label": "Trophy Change / Game" },
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="max-w-[200px] w-full justify-between"
                >
                    {statType
                        ? statTypes.find((statChoice) => statChoice.value === statType)?.label
                        : "..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
                <Command>
                    {/* <CommandInput placeholder="Search stats..." /> */}
                    <CommandList>
                        <CommandEmpty>No mode found</CommandEmpty>
                        <CommandGroup>
                            {statTypes.map((statChoice) => (
                                <CommandItem
                                    key={statChoice.value}
                                    value={statChoice.value}
                                    onSelect={(currentValue: string) => {
                                        setStatType(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={clsx(
                                            "mr-2 h-4 w-4",
                                            statType === statChoice.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {statChoice.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

}