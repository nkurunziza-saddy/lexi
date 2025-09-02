import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useCallback } from "react";

interface DropdownColorPickerProps {
  disabled?: boolean;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  buttonIcon: React.ElementType;
  color: string;
  onChange: (color: string, skipHistory: boolean) => void;
  title?: string;
}

const defaultColors = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#B7B7B7",
  "#CCCCCC",
  "#D9D9D9",
  "#EFEFEF",
  "#F3F3F3",
  "#FFFFFF",
  "#980000",
  "#FF0000",
  "#FF9900",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#4A86E8",
  "#0000FF",
  "#9900FF",
  "#FF00FF",
  "#E6B8AF",
  "#F4CCCC",
  "#FCE5CD",
  "#FFF2CC",
  "#D9EAD3",
  "#D0E0E3",
  "#C9DAF8",
  "#CFE2F3",
  "#D9D2E9",
  "#EAD1DC",
  "#DD7E6B",
  "#EA9999",
  "#F9CB9C",
  "#FFE599",
  "#B6D7A8",
  "#A2C4C9",
  "#A4C2F4",
  "#9FC5E8",
  "#B4A7D6",
  "#D5A6BD",
  "#CC4125",
  "#E06666",
  "#F6B26B",
  "#FFD966",
  "#93C47D",
  "#76A5AF",
  "#6D9EEB",
  "#6FA8DC",
  "#8E7CC3",
  "#C27BA0",
  "#A61C00",
  "#CC0000",
  "#E69138",
  "#F1C232",
  "#6AA84F",
  "#45818E",
  "#3C78D8",
  "#3D85C6",
  "#674EA7",
  "#A64D79",
  "#85200C",
  "#990000",
  "#B45F06",
  "#BF9000",
  "#38761D",
  "#134F5C",
  "#1155CC",
  "#0B5394",
  "#351C75",
  "#741B47",
  "#5B0F00",
  "#660000",
  "#783F04",
  "#7F6000",
  "#274E13",
  "#0C343D",
  "#1C4587",
  "#073763",
  "#20124D",
  "#4C1130",
];

function ColorSwatch({
  color,
  onClick,
}: {
  color: string;
  onClick: (color: string) => void;
}) {
  return (
    <button
      className="size-6 rounded-sm border"
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
      aria-label={`Color ${color}`}
    />
  );
}

export default function DropdownColorPicker({
  disabled,
  buttonClassName,
  buttonAriaLabel,
  buttonIcon: Icon,
  color,
  onChange,
  title,
}: DropdownColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const onColorChange = useCallback(
    (newColor: string, skipHistory: boolean) => {
      onChange(newColor, skipHistory);
      setIsOpen(false);
    },
    [onChange]
  );

  const onCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const applyCustomColor = useCallback(() => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (hexColorRegex.test(customColor)) {
      onColorChange(customColor, false);
    } else {
      // Maybe show an error to the user
    }
  }, [customColor, onColorChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={buttonAriaLabel}
          className={buttonClassName}
          title={title}
        >
          <Icon className="size-4" style={{ color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="mb-2 text-sm font-medium text-center">
          {title || "Color Picker"}
        </div>
        <div className="grid grid-cols-10 gap-1">
          {defaultColors.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              onClick={(newColor) => onColorChange(newColor, false)}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Input
            type="text"
            value={customColor}
            onChange={onCustomColorChange}
            className="h-8"
            placeholder="#RRGGBB"
          />
          <Button size="sm" onClick={applyCustomColor}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
