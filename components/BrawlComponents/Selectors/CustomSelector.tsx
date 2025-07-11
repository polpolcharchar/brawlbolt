import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { brawlerLabels } from "@/lib/BrawlUtility/BrawlConstants"
import clsx from "clsx"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"


type LabelChoice = {
    value: string
    label: string
}

export const CustomSelector = ({
    value,
    setValue,
    labels,
    noChoiceLabel,
    searchPlaceholder,
    emptySearch
}: {
    value: string,
    setValue: (value: string) => void,
    labels: LabelChoice[],
    noChoiceLabel: string,
    searchPlaceholder: string,
    emptySearch: string
}) => {

    const [open, setOpen] = useState(false);

    const sortedLabels = value
        ? [
            labels.find((label) => label.value === value)!,
            ...labels.filter((label) => label.value !== value)
        ]
        : labels;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="max-w-[200px] w-full justify-between"
                >
                    {value
                        ? labels.find((labelChoice) => labelChoice.value === value)?.label
                        : noChoiceLabel}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptySearch}</CommandEmpty>
                        <CommandGroup>
                            {sortedLabels.map((labelChoice) => (
                                <CommandItem
                                    key={labelChoice.value}
                                    value={labelChoice.value}
                                    onSelect={(currentValue: string) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={clsx(
                                            "mr-2 h-4 w-4",
                                            value === labelChoice.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {labelChoice.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

}