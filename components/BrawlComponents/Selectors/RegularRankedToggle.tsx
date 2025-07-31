import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export const RegularRankedToggle = ({ rankedVsRegularToggleValue, setRankedVsRegularToggleValue, statType }: { rankedVsRegularToggleValue: string, setRankedVsRegularToggleValue: (value: string) => void, statType: string }) => {
    return (
        <div className="flex items-center justify-between gap-4 text-(--muted-foreground)">
            <ToggleGroup
                type="single"
                value={rankedVsRegularToggleValue}
                onValueChange={(val) => {
                    if (val) setRankedVsRegularToggleValue(val);
                }}
                className="border rounded-lg max-w-[200px] w-full"
            >
                <ToggleGroupItem
                    value="regular"
                    className="px-4 py-2 data-[state=on]:bg-blue-700 data-[state=on]:text-(--foreground) data-[state=on]:border-blue-700"
                >
                    Regular
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="ranked"
                    className="px-4 py-2 data-[state=on]:bg-blue-700 data-[state=on]:text-(--foreground) data-[state=on]:border-blue-700"
                    disabled={statType === "trophyChange" || statType === "trophyChangePerGame"}
                >
                    Ranked
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}