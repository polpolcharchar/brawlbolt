import { typeLabels, typeLabelsGlobal } from "@/lib/BrawlUtility/BrawlConstants"
import { CustomSelector } from "./CustomSelector"

export const MatchTypeSelector = ({ matchType, setMatchType, isGlobal, disabled, hoverMessage }: { matchType: string, setMatchType: (value: string) => void, isGlobal: boolean, disabled?: boolean, hoverMessage?: string }) => {
    return (
        <CustomSelector
            value={matchType}
            setValue={setMatchType}
            labels={isGlobal ? typeLabelsGlobal : typeLabels}
            noChoiceLabel="Select Type..."
            searchPlaceholder="Search Types..."
            emptySearch="No Type Found"
            canBeEmpty={false}
            searchEnabled={false}
            hoverMessage={hoverMessage}
            disabled={disabled}
        />
    )
}