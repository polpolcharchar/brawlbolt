import { ChartLineIcon, ChartSplineIcon } from "lucide-react"

interface LinearNaturalChartToggleProps {
  type: "linear" | "natural";
  setType: (value: "linear" | "natural") => void;
}

export const LinearNaturalChartToggle = ({
  type,
  setType,
}: LinearNaturalChartToggleProps) => {
    const toggle = () => {
        if(type === "linear"){
            setType("natural");
        }else{
            setType("linear");
        }
    }

    return (
        <div onClick={toggle} className="cursor-pointer mt-2 text-(--foreground)">
            {type === "linear" ? (
                <ChartLineIcon/>
            ) : (
                <ChartSplineIcon/>
            )}
        </div>
    )

}