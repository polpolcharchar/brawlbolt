import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const LinkCopyIndicator = ({ url, title, copyClassName = "w-6 h-6", pulseAnimation = false }: { url: string, title: string, copyClassName?: string, pulseAnimation?: boolean }) => {

    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => setCopied(false), 5000);
    };

    return (
        <div className="relative group">
            <div onClick={handleCopyClick} className="mx-2 w-6 h-6 cursor-pointer hover:text-blue-500">
                {copied ? (
                    <Check className={"w-6 h-6 text-green-500" + (pulseAnimation && " animate-pulse")} />
                ) : (
                    <Copy className={copyClassName + (pulseAnimation && " animate-pulse")} />
                )}
            </div>

            <span className="absolute left-10 -top-1/2 transform -translate-x-1 bg-gray-700 text-(--foreground) text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                {copied ? "Copied" : title}
            </span>
        </div>
    )
}