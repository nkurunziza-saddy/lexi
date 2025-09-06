import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BlockFormatDropDown({ blockType }: { blockType: string }) {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (headingSize: "h1" | "h2" | "h3" | "h4") => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lowercase">
        <Button
          variant={
            ["h1", "h2", "h3"].includes(blockType) ? "secondary" : "ghost"
          }
          size={"sm"}
        >
          {blockType === "paragraph" ? (
            <Heading className="size-4" />
          ) : blockType === "h1" ? (
            <Heading1 className="size-4" />
          ) : blockType === "h2" ? (
            <Heading2 className="size-4" />
          ) : blockType === "h3" ? (
            <Heading3 className="size-4" />
          ) : blockType === "h4" ? (
            <Heading4 className="size-4" />
          ) : (
            <Heading className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {[
          {
            key: "heading 1",
            icon: Heading1,
            format: "h1",
            state: blockType === "h1",
            onClick: () => formatHeading("h1"),
          },
          {
            key: "heading 2",
            icon: Heading2,
            format: "h2",
            state: blockType === "h2",
            onClick: () => formatHeading("h2"),
          },
          {
            key: "heading 3",
            icon: Heading3,
            format: "h3",
            state: blockType === "h3",
            onClick: () => formatHeading("h3"),
          },
          {
            key: "heading 4",
            icon: Heading4,
            format: "h4",
            state: blockType === "h4",
            onClick: () => formatHeading("h4"),
          },
          {
            key: "paragraph",
            icon: Heading,
            format: "p",
            state: blockType === "paragraph",
            onClick: formatParagraph,
          },
        ].map(({ key, icon: Icon, state, onClick }) => (
          <DropdownMenuItem
            key={key}
            className={"flex items-center justify-between gap-5"}
            onSelect={onClick}
          >
            <div className="flex items-center">
              <Icon className="size-4" />{" "}
              <span className="ml-2 capitalize text-sm text-muted-foreground">
                {key}
              </span>
            </div>
            {state ? <Check className="ml-auto size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
