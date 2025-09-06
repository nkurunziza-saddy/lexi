import { cn } from "@/lib/utils";

interface Props {
  orientation?: "vertical" | "horizontal";
}
const Separator = ({ orientation = "vertical" }: Props) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-transparent via-border to-transparent mx-2",
        orientation === "horizontal" ? "h-px w-6 my-2" : "w-px h-6 mx-2"
      )}
    />
  );
};

export default Separator;
