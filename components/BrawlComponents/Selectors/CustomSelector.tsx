import { useState } from "react"
import clsx from "clsx"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Check, ChevronsUpDown } from "lucide-react"

type LabelChoice = {
    value: string
    label: string
}

type CustomSelectorProps = {
    value: string
    setValue: (value: string) => void
    labels: LabelChoice[]
    noChoiceLabel: string
    searchPlaceholder: string
    emptySearch: string
    disabled?: boolean
    canBeEmpty?: boolean
    searchEnabled?: boolean
    hoverMessage?: string
}

export const CustomSelector = ({
    value,
    setValue,
    labels,
    noChoiceLabel,
    searchPlaceholder,
    emptySearch,
    disabled = false,
    canBeEmpty = true,
    searchEnabled = true,
    hoverMessage = "",
}: CustomSelectorProps) => {
    const [open, setOpen] = useState(false)

    const sortedLabels = value
        ? [
            ...labels.filter((label) => label.value === value),
            ...labels.filter((label) => label.value !== value),
        ]
        : labels

    const SelectorPopover = (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="max-w-[200px] justify-between"
                    disabled={disabled}
                >
                    {value
                        ? labels.find((labelChoice) => labelChoice.value === value)?.label
                        : noChoiceLabel}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px] p-0" side="bottom" align="start">
                <Command>
                    {searchEnabled && (
                        <CommandInput
                            placeholder={searchPlaceholder}
                            disabled={disabled}
                        />
                    )}
                    <CommandList>
                        <CommandEmpty>{emptySearch}</CommandEmpty>
                        <CommandGroup>
                            {sortedLabels.map((labelChoice) => (
                                <CommandItem
                                    key={labelChoice.value}
                                    value={labelChoice.value}
                                    onSelect={(currentValue: string) => {
                                        if (!disabled) {
                                            if (currentValue === value) {
                                                if (canBeEmpty) {
                                                    setValue("")
                                                }
                                            } else {
                                                setValue(currentValue)
                                            }
                                            setOpen(false)
                                        }
                                    }}
                                    disabled={disabled}
                                >
                                    <Check
                                        className={clsx(
                                            "mr-2 h-4 w-4",
                                            value === labelChoice.value
                                                ? "opacity-100"
                                                : "opacity-0"
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

    return hoverMessage ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>{SelectorPopover}</span>
                </TooltipTrigger>
                <TooltipContent className="text-white">{hoverMessage}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        SelectorPopover
    )
}
