"use client"

import { Button } from "@/components/ui/button"
import { calculateProportionConfidenceInterval } from "@/lib/StatisticalCalculator"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { BrawlerData } from "./BrawlerTable"

interface SortingHeaderProps {
    column: any;
    label: string;
    defaultSortDirection?: "asc" | "desc";
}
export const SortingHeader: React.FC<SortingHeaderProps> = ({ column, label, defaultSortDirection = "asc" }) => {
    const isSorted = column.getIsSorted();
    const ArrowIcon = isSorted === "asc"
        ? <ArrowDown className="ml-2 h-4 w-4" />
        : isSorted === "desc"
            ? <ArrowUp className="ml-2 h-4 w-4" />
            : <ArrowUpDown className="ml-2 h-4 w-4" />;

    return (
        <Button
            variant="ghost"
            onClick={() => {
                if (!isSorted) {
                    // Toggle to defaultSortDirection if column is not sorted
                    column.toggleSorting(defaultSortDirection === "desc");
                } else {
                    // Toggle to the opposite of current sort
                    column.toggleSorting(isSorted === "asc");
                }
            }}
        >
            {label}
            {ArrowIcon}
        </Button>
    );
};

interface ConfidenceIntervalCellProps<T> {
    row: T;
    rateName: keyof T; // key for the proportion (e.g., "winrate")
    sampleSizeName: keyof T; // key for the sample size (e.g., "numGames")
    confidenceLevel: number; // e.g., 0.95, 0.99
    calculateProportionConfidenceInterval: (
        x: number,
        n: number,
        confidenceLevel: number
    ) => { lowerBound: number; upperBound: number };
}
function ConfidenceIntervalCell<T extends Record<string, any>>({
    row,
    rateName,
    sampleSizeName,
    confidenceLevel,
    calculateProportionConfidenceInterval,
}: ConfidenceIntervalCellProps<T>) {
    const [isHovered, setIsHovered] = useState(false);
    const [confidenceInterval, setConfidenceInterval] = useState<{ lowerBound: number; upperBound: number } | null>(null);

    const winrate: number = row[rateName];
    const amount = winrate * 100;
    const roundedAmount = amount.toFixed(2);

    return (
        <div
            onMouseEnter={() => {
                // if (!confidenceInterval) {
                const sampleSize: number = row[sampleSizeName];
                const winProportion: number = winrate * sampleSize;
                const interval = calculateProportionConfidenceInterval(winProportion, sampleSize, confidenceLevel);
                setConfidenceInterval(interval);
                // }
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && confidenceInterval
                ? `(${(confidenceInterval.lowerBound * 100).toFixed(2)}, ${(confidenceInterval.upperBound * 100).toFixed(2)})`
                : roundedAmount}
        </div>
    );
}

export const columns: ColumnDef<BrawlerData>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <SortingHeader column={column} label="Name" />,
        cell: ({ row }) => {
            const [isHovered, setIsHovered] = useState(false);

            return (
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center"
                >

                    <p className="text-sm">{row.getValue("name")}</p>

                    {/* {isHovered && (
                        <p className="text-xs text-gray-300 ml-2">{"Click!"}</p>
                    )} */}
                </div>
            );
        },
    },
    {
        accessorKey: "winrate",
        header: ({ column }) => <SortingHeader column={column} label="Winrate" defaultSortDirection="desc" />,
        cell: ({ row }) => (
            <ConfidenceIntervalCell
                row={row.original}
                rateName="winrate"
                sampleSizeName="numGames"
                confidenceLevel={0.95}
                calculateProportionConfidenceInterval={calculateProportionConfidenceInterval}
            />
        )
    },
    {
        accessorKey: "starRate",
        header: ({ column }) => <SortingHeader column={column} label="Star Rate" defaultSortDirection="desc" />,
        cell: ({ row }) => (
            <ConfidenceIntervalCell
                row={row.original}
                rateName="starRate"
                sampleSizeName="numGames"
                confidenceLevel={0.95}
                calculateProportionConfidenceInterval={calculateProportionConfidenceInterval}
            />
        )
    },
    {
        accessorKey: "drawRate",
        header: ({ column }) => <SortingHeader column={column} label="Draw Rate" defaultSortDirection="desc" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("drawRate")) * 100;
            const roundedAmount = amount.toFixed(2); // Round to 2 decimal places

            return roundedAmount;
        },
    },
    {
        accessorKey: "numGames",
        header: ({ column }) => <SortingHeader column={column} label="# Games" defaultSortDirection="desc" />,
    }
]